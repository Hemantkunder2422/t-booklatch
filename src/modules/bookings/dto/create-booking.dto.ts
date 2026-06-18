import { EventType,BookingSlot, BookingStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsEnum, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class  CreateBookingDto {
    @IsString()
    venueId!:string;

    @IsString()
    venueSpaceId!:string;

     @IsString()
    customerName!:string;

    @IsPhoneNumber()
    customerPhone!:string;

    @IsEmail()    
    customerEmail!:string;

    @IsDateString()
    bookingDate!:Date;

    @IsEnum(BookingStatus)
    bookingStatus!:BookingStatus

    @IsString()
    eventName!:string;

    @IsEnum(EventType)
    eventType!:EventType

    @IsEnum(BookingSlot)
    slot!:BookingSlot
                                                                                        
    @IsNumber()
    pax!:number

    @IsString()
    notes!:string
}