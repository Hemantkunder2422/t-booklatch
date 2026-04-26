import { Role, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsEnum(UserType)
  userType!: UserType;

  @IsEnum(Role)
  role!: Role;
}
