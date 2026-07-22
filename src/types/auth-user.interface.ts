import { Role, TenantType, UserType } from '@prisma/client';

export interface AuthUser {
  userId: string;
  role: Role;
  type: UserType;
  venueId?: string;
  vendorId?: string;
  tenantId?: string;
  tenantType?: TenantType;
}
