import { Role, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class UserInviteDto {
  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;

  @IsEnum(UserType)
  userType!: UserType;

  @IsString()
  tenantId!: string;
}
