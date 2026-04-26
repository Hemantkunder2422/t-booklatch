import { Role, UserType } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class InviteDto {
  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;

  @IsEnum(UserType)
  userType!: UserType;
}
