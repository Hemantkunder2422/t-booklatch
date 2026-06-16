import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { BookingsService } from './bookings.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CurrentUser } from '../user/current-user.decorator';
import type { AuthUser } from 'src/types/auth-user.interface';


@Controller('bookings')
@UseGuards(JwtAuthGuard,RolesGuard)
export class BookingsController {
    constructor(private booking:BookingsService){}

    @Post('create')
    @Roles(Role.VENUE_ADMIN,Role.VENUE_STAFF)
    async createBooking(@Body() dto:CreateBookingDto , @CurrentUser() user:AuthUser){
        return this.booking.create(dto,user)
    }
}
