import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { TemplateService } from './template.service';

@Module({
  controllers: [MailController],
  providers: [MailService, TemplateService],
  exports: [MailService],
})
export class MailModule {}
