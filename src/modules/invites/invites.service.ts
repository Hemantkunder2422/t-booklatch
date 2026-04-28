import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteDto } from './dto/invite.dto';
import { AuthUser } from 'src/types/auth-user.interface';
import { Role } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { ResendInviteDto } from './dto/resend-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async sendInvite(dto: InviteDto, user: AuthUser) {
    const existingInvite = await this.prisma.invite.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (existingInvite) throw new ConflictException('Invite already sent');
    const token = randomBytes(32).toString('hex');
    const hashToken = createHash('sha256').update(token).digest('hex');

    await this.prisma.invite.create({
      data: {
        ...dto,
        token: hashToken,
        invitedById: user.userId,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });

    return {
      data: `Invite sent to ${dto.email}`,
    };
  }

  async resendInvite(dto: ResendInviteDto, user: AuthUser) {
    console.log(dto);
    const existingInvite = await this.prisma.invite.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!existingInvite) throw new NotFoundException('Invite not found');

    if (existingInvite) {
      await this.prisma.invite.update({
        where: {
          id: existingInvite.id,
        },
        data: {
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      });
    }

    return {
      message: `Invite Resent to ${existingInvite?.email}`,
    };
  }

  async acceptInvite(dto: AcceptInviteDto) {
    if (dto.password !== dto.repassword) {
      throw new ConflictException('Passwords do not match');
    }

    const inviteToken = await this.prisma.invite.findUnique({
      where: { token: dto.token },
    });

    if (!inviteToken) {
      throw new NotFoundException('Invite not found');
    }

    if (inviteToken.isUsed) {
      throw new ConflictException('Invite already used');
    }

    if (inviteToken.expiresAt < new Date()) {
      throw new ForbiddenException('Invite has expired');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: inviteToken.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name: dto.name,
          email: inviteToken.email,
          password: hashedPassword,
          role: inviteToken.role,
          userType: inviteToken.userType,
        },
      });

      await tx.invite.update({
        where: { id: inviteToken.id },
        data: { isUsed: true },
      });
    });

    return { message: 'Invite accepted successfully' };
  }

  async userInvite(dto: InviteDto) {
    return 'Invite users';
  }
}
