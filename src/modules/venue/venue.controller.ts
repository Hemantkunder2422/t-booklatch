import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VenueService } from './venue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateVenueDto } from './dto/create-venue.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('venue')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VenueController {
  constructor(private venueService: VenueService) {}

  @Post('add-venue')
  @Roles(Role.VENUE_ADMIN)
  async register(@Body() dto: CreateVenueDto) {
    return this.venueService.createVenue(dto);
  }
}
