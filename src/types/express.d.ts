import { AuthUser } from './modules/auth/auth-user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
