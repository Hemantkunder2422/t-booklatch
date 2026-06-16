import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class BookingsService {
    constructor(private prisma:PrismaService){}

    async create(dto:CreateBookingDto,user:AuthUser){
        return "Bookings route"
    }
}
