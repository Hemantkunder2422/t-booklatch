import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import type { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

   async createVenue(dto: CreateVenueDto, user: AuthUser) {
    return this.prisma.$transaction(async (tx) => {
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

      await tx.user.update({
        where: { id: user.userId },
        data: {
          venue: {
            connect: { id: venue.id },
          },
        },
      });

      return venue;
    },{
      maxWait:10000,
      timeout:30000
    });
  }
}
