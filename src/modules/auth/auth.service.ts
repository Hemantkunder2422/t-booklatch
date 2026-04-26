import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ConflictException('User not found');

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) throw new ConflictException('Invalid credentials');

    if (!user.isActive) throw new ConflictException('User is not active');

    const tokenPayload = {
      sub: user.id,
      role: user.role,
      venueId: user.venueId,
      vendorId: user.vendorId,
      type: user.userType,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      expiresIn: '15m',
    });

    const refreshToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      message: 'Login successful',
      refreshToken: tokenHash,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.userType,
      },
    };
  }
}
