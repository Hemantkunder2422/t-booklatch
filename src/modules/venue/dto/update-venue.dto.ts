import { IsNumber, IsString } from "class-validator";

export class UpdateVenueSpace {
    @IsString()
    venueId!:string;

    @IsString()
    name!:string;

    @IsString()
    description!:string

    @IsNumber()
    pax!:number
}