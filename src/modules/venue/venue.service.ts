import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

  async createVenue(dto: CreateVenueDto) {
    return this.prisma.venue.create({
      data: {
        ...dto,
      },
    });
  }
}
