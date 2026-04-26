import { IsEmail, IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsString()
  token!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
