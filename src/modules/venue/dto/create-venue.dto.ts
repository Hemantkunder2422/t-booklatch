import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsString()
  @IsOptional()
  address!: string;

  @IsString()
  @IsOptional()
  city!: string;

  @IsString()
  @IsOptional()
  state!: string;

  @IsString()
  @IsOptional()
  country!: string;

  @IsString()
  @IsOptional()
  pincode!: string;

  @IsString()
  @IsOptional()
  phone!: string;

  @IsString()
  @IsOptional()
  email!: string;

  @IsString()
  @IsOptional()
  website!: string;

  @IsNumber()
  @IsOptional()
  capacity!: number;

  @IsNumber()
  @IsOptional()
  priceRange!: string;
}
