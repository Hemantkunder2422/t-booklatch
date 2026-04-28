import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import type { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

  async createVenue(dto: CreateVenueDto, user: AuthUser) {
    const creationTransaction = await this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.create({
        data: {
          ...dto,
          createdById: user.userId,
          ownerId: user.userId,
        },
      });

      await tx.user.update({
        where: { id: user.userId },
        data: {
          ven,
        },
      });
    });
  }
}
