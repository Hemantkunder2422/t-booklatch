import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  name!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsEmail()
  email!: string;
}
