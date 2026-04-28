import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  state!: string;

  @IsOptional()
  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  pincode!: string;

  @IsOptional()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  website!: string;

  @IsOptional()
  @IsNumber()
  capacity!: number;

  @IsOptional()
  @IsString()
  priceRange!: string;
}
