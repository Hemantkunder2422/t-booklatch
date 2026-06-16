import { EventType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNumber, IsPhoneNumber, IsString } from "class-validator";

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

    @IsString()
    eventName!:string;

    @IsEnum(EventType)
    eventType!:EventType

    @Type(() => Date)
    @IsDate()
    startDate!:Date

    @Type(() => Date)
    @IsDate()
    endDate!:Date

    @IsNumber()
    pax!:number

    @IsString()
    notes!:string
}