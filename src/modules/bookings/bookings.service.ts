import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, user: AuthUser) {
    // A venue-scoped user may only create bookings for their own venue.
    if (user.venueId && user.venueId !== dto.venueId) {
      throw new ForbiddenException('Cannot create bookings for another venue');
    }

    // Ensure the space exists and actually belongs to the given venue,
    // otherwise we'd persist a structurally inconsistent booking.
    const venueSpace = await this.prisma.venueSpaces.findUnique({
      where: { id: dto.venueSpaceId },
      select: { venueId: true },
    });

    if (!venueSpace) {
      throw new NotFoundException('Venue space not found');
    }
    if (venueSpace.venueId !== dto.venueId) {
      throw new BadRequestException(
        'Venue space does not belong to the given venue',
      );
    }

    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        venueSpaceId: dto.venueSpaceId,
        bookingDate: dto.bookingDate,
        slot: dto.slot,
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
    });
    if (existingBooking) {
      throw new ConflictException('Booking already exists');
    }

    try {
      // bookingStatus is intentionally not taken from the client; the schema
      // default (PENDING) controls the initial state.
      return await this.prisma.booking.create({
        data: {
          venueId: dto.venueId,
          venueSpaceId: dto.venueSpaceId,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          eventName: dto.eventName,
          eventType: dto.eventType,
          bookingDate: dto.bookingDate,
          slot: dto.slot,
          pax: dto.pax,
          notes: dto.notes,
          createdById: user.userId,
        },
      });
    } catch (error) {
      // Backstop for the race between the findFirst check above and this
      // insert: the @@unique([venueSpaceId, bookingDate, slot]) constraint
      // rejects a concurrent duplicate with P2002.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Booking already exists');
      }
      throw error;
    }
  }
}
