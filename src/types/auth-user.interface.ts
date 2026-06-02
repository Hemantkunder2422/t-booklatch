import { Role, UserType } from '@prisma/client';

export interface AuthUser {
  userId: string;
  role: Role;
  userType:UserType;
  venueId?: string;
  vendorId?: string;
}
