import { Role, TenantType, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class InviteDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsEnum(TenantType)
  tenantType!: TenantType;

  @IsOptional()
  @IsEnum(UserType)
  userType!: UserType;
}
