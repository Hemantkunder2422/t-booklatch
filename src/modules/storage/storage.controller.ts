import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UploadFile } from './interfaces/upload-file.interface';
import { CurrentUser } from '../user/current-user.decorator';
import type { AuthUser } from 'src/types/auth-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: UploadFile,
    @CurrentUser() user: AuthUser,
  ) {
    return this.storageService.upload(file, 'users', user.userId);
  }
}
