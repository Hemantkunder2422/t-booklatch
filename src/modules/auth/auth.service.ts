import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { TenantType, type User } from '@prisma/client';
import type { AuthUser } from 'src/types/auth-user.interface';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly mailServices: MailService,
    private configService: ConfigService,
  ) {}

  private buildPayload(user: User) {
    return {
      sub: user.id,
      role: user.role,
      vendorId: user.vendorId,
      type: user.userType,
      tenantId: user.tenantId,
    };
  }

  private issueAccessToken(user: User) {
    return this.jwtService.sign(this.buildPayload(user), {
      expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXPIRY'),
    });
  }

  /**
   * Generates a random refresh token, persists its SHA-256 hash, and returns
   * the plaintext token (only the hash is ever stored).
   */
  private async issueRefreshToken(userId: string) {
    const refreshToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return refreshToken;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Use a single generic error for missing user and bad password so the
    // endpoint can't be used to enumerate registered accounts.
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    const accessToken = this.issueAccessToken(user);
    const refreshToken = await this.issueRefreshToken(user.id);

    void this.mailServices
      .sendLoginNotification(user.name, user.email)
      .catch((error) => {
        console.error('Error sending login notification:', error);
      });

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.userType,
        tenantId: user.tenantId,
      },
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Invalid or missing token');

    const hashToken = this.hashToken(refreshToken);
    await this.prisma.refreshToken.deleteMany({ where: { token: hashToken } });
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const hashToken = this.hashToken(refreshToken);

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: hashToken,
        isRevoked: false,
      },
      include: { user: true },
    });

    if (!storedToken) throw new UnauthorizedException('Invalid refresh token');
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = storedToken.user;
    const accessToken = this.issueAccessToken(user);

    // Rotate the refresh token atomically: deleting the old token and issuing a
    // new one must both succeed, otherwise the user would be left unable to
    // refresh.
    const newRefreshTokenPlain = randomBytes(32).toString('hex');
    const newTokenHash = this.hashToken(newRefreshTokenPlain);

    await this.prisma.$transaction([
      this.prisma.refreshToken.delete({ where: { id: storedToken.id } }),
      this.prisma.refreshToken.create({
        data: {
          token: newTokenHash,
          userId: user.id,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
      }),
    ]);

    return { accessToken, refreshToken: newRefreshTokenPlain };
  }

  async currentUser(user: AuthUser) {
    if (!user) throw new UnauthorizedException('User not found');

    const found = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
        tenant: true,
      },
    });

    if (!found) throw new NotFoundException('User not found');

    return found;
  }

  async allUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
        tenant: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
}
