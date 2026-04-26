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

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async getInvite(dto: InviteDto, user: AuthUser) {
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
        token:hashToken,
        invitedById: user.userId,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });

    return {
      data: `Invite sent to ${dto.email}`,
    };
  }

  async resendInvite(dto:ResendInviteDto, user:AuthUser){
    console.log(dto)
    const existingInvite = await this.prisma.invite.findFirst({
      where:{
        email:dto.email
      }
    })

    if(!existingInvite) throw new NotFoundException('Invite not found')

    if(existingInvite){
      await this.prisma.invite.update({
        where:{
          id:existingInvite.id
        },
        data:{
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        }
      })
    }

    return {
      message:`Invite Resent to ${existingInvite?.email}`
    }
  }
}
