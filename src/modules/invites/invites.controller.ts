import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
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
import { AcceptInviteDto } from './dto/accept-invite.dto';

@Controller('invite')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitesController {
  constructor(private invite: InvitesService) {}

  //route with role guard to make sure only super admin can send invites
  @Post('send')
  @Roles(Role.SUPER_ADMIN)
  async sendInvite(@Body() dto: InviteDto, @CurrentUser() user: AuthUser) {
    return this.invite.sendInvite(dto, user);
  }

  @Post('resend')
  @Roles(Role.SUPER_ADMIN)
  async resendInvite(
    @Body() dto: ResendInviteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.invite.resendInvite(dto, user);
  }

  @Post('user')
  @Roles(Role.VENUE_ADMIN, Role.VENDOR_ADMIN)
  async inviteUser(@Body() dto: InviteDto) {
    return this.invite.userInvite(dto);
  }

  @Post('accept')
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.invite.acceptInvite(dto);
  }
}
