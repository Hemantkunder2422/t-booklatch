import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';

@Module({
  controllers: [WebsiteController],
  providers: [WebsiteService],
})
export class WebsiteModule {}
