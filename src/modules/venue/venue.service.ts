import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import type { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

   async createVenue(dto: CreateVenueDto, user: AuthUser) {
    return this.prisma.$transaction(async (tx) => {
      
      // ✅ 1. Check if user already owns a venue
      const existingVenue = await tx.venue.findUnique({
        where: { ownerId: user.userId },
      });

      if (existingVenue) {
        throw new ConflictException('User already owns a venue');
      }

      // ✅ 2. Create venue using relations (clean & safe)
      const venue = await tx.venue.create({
        data: {
          ...dto,

          createdBy: {
            connect: { id: user.userId },
          },

          owner: {
            connect: { id: user.userId },
          },
        },
      });

      // ✅ 3. Update user safely
      await tx.user.update({
        where: { id: user.userId },
        data: {
          venue: {
            connect: { id: venue.id },
          },
        },
      });

      return venue;
    });
  }
}
