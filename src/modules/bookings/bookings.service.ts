import { ConflictException, Injectable } from '@nestjs/common';
import {
  BookingStatus,
  CalendarStatus,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthUser } from 'src/types/auth-user.interface';

// Statuses that still hold the slot and therefore block an overlapping booking.
const BLOCKING_STATUSES = [
  BookingStatus.PENDING,
  BookingStatus.BOOKING_IN_PROGRESS,
  BookingStatus.LOCKED,
  BookingStatus.CONFIRMED,
];

// Name of the Postgres EXCLUDE constraint added in the booking_no_overlap_guard
// migration. A violation (SQLSTATE 23P01) means the DB-level guard rejected an
// overlapping booking that slipped past the app-level check.
const OVERLAP_CONSTRAINT = 'booking_no_overlap';

function isOverlapViolation(err: unknown): boolean {
  const meta =
    err instanceof Prisma.PrismaClientKnownRequestError
      ? (err.meta as { code?: string; constraint?: string } | undefined)
      : undefined;
  if (meta?.code === '23P01' || meta?.constraint === OVERLAP_CONSTRAINT) {
    return true;
  }
  const message = err instanceof Error ? err.message : String(err);
  return message.includes(OVERLAP_CONSTRAINT) || message.includes('23P01');
}

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private payment: PaymentService,
  ) {}

  async create(dto: CreateBookingDto, user: AuthUser) {
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          // 1. Serialize concurrent bookings for the same space + date so the
          //    overlap check below cannot race. The lock is scoped to this
          //    transaction and released automatically on commit/rollback.
          const lockKey = `${dto.venueSpaceId}:${String(dto.bookingDate)}`;
          await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

          // 2. Reject if the requested time range overlaps a slot that is still held.
          const overlap = await tx.booking.findFirst({
            where: {
              venueSpaceId: dto.venueSpaceId,
              bookingDate: dto.bookingDate,
              bookingStatus: { in: BLOCKING_STATUSES },
              startTime: { lt: dto.end_time },
              endTime: { gt: dto.start_time },
            },
            select: { id: true },
          });

          if (overlap) {
            throw new ConflictException(
              'Selected time slot overlaps with an existing booking.',
            );
          }

          // 3. Create the booking — in progress until payment settles.
          const booking = await tx.booking.create({
            data: {
              venueId: dto.venueId,
              venueSpaceId: dto.venueSpaceId,
              customerName: dto.customerName,
              customerEmail: dto.customerEmail,
              customerPhone: dto.customerPhone,
              eventName: dto.eventName,
              eventType: dto.eventType,
              bookingDate: dto.bookingDate,
              startTime: dto.start_time,
              endTime: dto.end_time,
              pax: dto.pax,
              notes: dto.notes,
              bookingStatus: BookingStatus.BOOKING_IN_PROGRESS,
              createdById: user.userId,
            },
          });

          // 4. Record the payment attempt as PENDING.
          const payment = await tx.payment.create({
            data: {
              bookingId: booking.id,
              amount: new Prisma.Decimal(dto.amount),
              currency: 'INR',
              paymentMethod: dto.paymentMethod,
              paymentStatus: PaymentStatus.PENDING,
            },
          });

          // 5. Charge via the (mock) gateway.
          const result = await this.payment.charge({
            bookingId: booking.id,
            amount: dto.amount,
            currency: 'INR',
            method: dto.paymentMethod,
            customerEmail: dto.customerEmail,
          });

          // On failure, throw to roll the whole transaction back — no booking,
          // payment or calendar entry is persisted.
          if (!result.success) {
            throw new ConflictException(
              result.failureReason ?? 'Payment failed. Booking not created.',
            );
          }

          // 6. Payment succeeded — mark it PAID with the gateway references.
          const paidPayment = await tx.payment.update({
            where: { id: payment.id },
            data: {
              paymentStatus: PaymentStatus.PAID,
              paidAt: result.paidAt,
              transactionID: result.transactionId,
              gatewayOrderId: result.gatewayOrderId,
              gatewayPaymentId: result.gatewayPaymentId,
              gatewaySignature: result.gatewaySignature,
            },
          });

          // 7. Block the slot on the venue-space calendar.
          await tx.venueSpaceCalendar.create({
            data: {
              venueSpaceId: dto.venueSpaceId,
              date: dto.bookingDate,
              startTime: dto.start_time,
              endTime: dto.end_time,
              status: CalendarStatus.BOOKED,
              bookingId: booking.id,
              notes: `Booked: ${dto.eventName}`,
            },
          });

          // 8. Confirm the booking.
          const confirmedBooking = await tx.booking.update({
            where: { id: booking.id },
            data: { bookingStatus: BookingStatus.CONFIRMED },
          });

          return { booking: confirmedBooking, payment: paidPayment };
        },
        // Interactive transaction guardrails.
        { maxWait: 5000, timeout: 15000 },
      );
    } catch (err) {
      // The DB EXCLUDE guard fires only if a booking slips past the app-level
      // check above (true race). Translate it into the same clean 409.
      if (isOverlapViolation(err)) {
        throw new ConflictException(
          'Selected time slot overlaps with an existing booking.',
        );
      }
      throw err;
    }
  }
}
