import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthUser } from 'src/types/auth-user.interface';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, user: AuthUser) {
    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        venueSpaceId: dto.venueSpaceId,

        bookingDate: dto.bookingDate,

        bookingStatus: {
          in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.BOOKING_IN_PROGRESS,
            BookingStatus.LOCKED,
          ],
        },

        AND: [
          {
            startTime: {
              lt: dto.end_time,
            },
          },
          {
            endTime: {
              gt: dto.start_time,
            },
          },
        ],
      },
    });

    if (overlappingBooking) {
      throw new ConflictException(
        'Selected time slot overlaps with an existing booking.',
      );
    }

    // Ensure customer is created or linked based on email/phone if they provide it.
    // Given the new Customer model with soft delete, we'll try to find an existing active customer
    // or create a new one. Since we don't have customerId in DTO yet, we'll match by email/phone or just create.
    let customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { email: dto.customerEmail },
          { phone: dto.customerPhone }
        ],
        deletedAt: null // Only active customers
      }
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          name: dto.customerName,
          email: dto.customerEmail,
          phone: dto.customerPhone,
        }
      });
    }

    await this.prisma.booking.create({
      data: {
        venueId: dto.venueId,
        venueSpaceId: dto.venueSpaceId,
        customerId: customer.id,
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
        createdById: user.userId,
      },
    });

    return 'Booking created';
  }
}