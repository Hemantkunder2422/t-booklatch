import { EventType, PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  venueId!: string;

  @IsString()
  venueSpaceId!: string;

  @IsString()
  customerName!: string;

  @IsPhoneNumber()
  customerPhone!: string;

  @IsEmail()
  customerEmail!: string;

  @IsDateString()
  bookingDate!: Date;

  @IsString()
  eventName!: string;

  @IsEnum(EventType)
  eventType!: EventType;

  @Type(() => Date)
  @IsDate()
  start_time!: Date;

  @Type(() => Date)
  @IsDate()
  end_time!: Date;

  @IsNumber()
  pax!: number;

  @IsString()
  notes!: string;

  // Amount to collect for this booking (mock payment for now).
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsEnum(PaymentType)
  paymentMethod!: PaymentType;
}
