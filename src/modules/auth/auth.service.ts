import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import type { AuthUser } from 'src/types/auth-user.interface';

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
      refreshToken: refreshToken,
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

  async logout(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Invalid or missing token');

    const hashToken = createHash('sha256').update(refreshToken).digest('hex');
    console.log(hashToken);
    await this.prisma.refreshToken.deleteMany({ where: { token: hashToken } });
  }

  async refresh(refreshToken: string) {}

  async currentUser(user: AuthUser) {
    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
      },
    });
  }

  async allUsers() {
    const users = await this.prisma.user.findMany({});
    return users;
  }
  //this is a comment
}
