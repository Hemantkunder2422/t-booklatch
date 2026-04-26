import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: unknown, user: unknown): TUser {
    console.log(user);
    if (err) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    return user as TUser;
  }
}
