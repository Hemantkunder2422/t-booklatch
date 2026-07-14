import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, user: AuthUser) {
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        venueSpaceId: dto.venueSpaceId,
        bookingDate: dto.bookingDate,
        startTime: dto.start_time,
        endTime: dto.end_time,
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
    });
    if (existingBooking) {
      throw new ConflictException('Booking already exists');
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
      },
    });
    return 'Booking created';
  }
}
