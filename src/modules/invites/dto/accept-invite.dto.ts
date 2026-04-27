import { IsEmail, IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsString()
  token!: string;

  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsString()
  repassword!: string;
}
