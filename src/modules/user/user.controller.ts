import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { AuthUser } from 'src/types/auth-user.interface';
import { Role } from '@prisma/client';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN, Role.VENDOR_ADMIN, Role.VENDOR_ADMIN)
  async create(@Body() dto: CreateUserDto) {
    const result = await this.userService.createUser(dto);
    return result;
  }
}
