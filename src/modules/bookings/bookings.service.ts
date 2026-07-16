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

    await this.prisma.booking.create({
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
        createdById: user.userId,
      },
    });

    return 'Booking created';
  }
}