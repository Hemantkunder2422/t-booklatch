import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateVenueDto } from './dto/create-venue.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../user/current-user.decorator';
import type { AuthUser } from 'src/types/auth-user.interface';
import { AddVenueSpace } from './dto/add-venue-space.dto';

@Controller('venue')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VenueController {
  constructor(private venueService: VenueService) {}

  @Post('add-venue')
  @Roles(Role.MANAGER, Role.OWNER)
  async register(@Body() dto: CreateVenueDto, @CurrentUser() user: AuthUser) {
    return this.venueService.createVenue(dto, user);
  }

  @Post('add-space')
  @Roles(Role.MANAGER, Role.OWNER)
  async addSpace(@Body() dto: AddVenueSpace, @CurrentUser() user: AuthUser) {
    return this.venueService.addVenueSpace(dto, user);
  }

  @Delete('remove-space/:spaceId')
  @Roles(Role.OWNER, Role.MANAGER)
  async removeSpace(
    @Param('spaceId') spaceId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.venueService.removeSpace(spaceId, user);
  }
}
