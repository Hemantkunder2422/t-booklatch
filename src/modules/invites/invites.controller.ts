import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InviteDto } from './dto/invite.dto';
import { CurrentUser } from '../user/current-user.decorator';
import type { AuthUser } from 'src/types/auth-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/roles.guard';
import { ResendInviteDto } from './dto/resend-invite.dto';

@Controller('invite')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.SUPER_ADMIN)
export class InvitesController {
  constructor(private invite: InvitesService) {}

  @Post('send')
  async sendInvite(@Body() dto: InviteDto, @CurrentUser() user: AuthUser) {
    return this.invite.getInvite(dto, user);
  }

  @Post('resend')
  async resendInvite(@Body() dto:ResendInviteDto, @CurrentUser() user: AuthUser){
    return this.invite.resendInvite(dto,user)
  }

}
