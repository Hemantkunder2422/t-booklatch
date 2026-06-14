import { IsNumber, IsString } from "class-validator";

export class AddVenueSpace {
    @IsString()
    venueId!:string;

    @IsString()
    name!:string;

    @IsString()
    description!:string

    @IsNumber()
    pax!:number
}