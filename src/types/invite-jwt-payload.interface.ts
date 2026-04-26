import { Role, UserType } from '@prisma/client';

export interface InviteJwtPayload {
  email: string;
  role: Role;
  userType: UserType;
}
