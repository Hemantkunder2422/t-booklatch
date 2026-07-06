import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  name!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  message!: string;
}
