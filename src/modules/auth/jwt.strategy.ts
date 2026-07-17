import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.accessToken,
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }
  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      role: payload.role,
      type: payload.type,
      venueId: payload.venueId,
      vendorId: payload.vendorId,
    };
  }
}
