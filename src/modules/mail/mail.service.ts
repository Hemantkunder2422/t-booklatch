import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from './template.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly sesClient = new SESClient();

  constructor(private readonly templateService: TemplateService) {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async sendLoginNotification(name: string, email: string) {
    const html = this.templateService.compile('login-notification', {
      name,
      loginTime: new Date().toLocaleString(),
    });

    const params: SendEmailCommandInput = {
      Source: process.env.MAIL_FROM,
      Destination: {
        ToAddresses: ['support@booklatch.com'],
      },
      Message: {
        Subject: {
          Data: 'Login Notification',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      const result = await this.sesClient.send(new SendEmailCommand(params));
      this.logger.log('Email sent successfully', result.MessageId);
    } catch (error) {
      this.logger.error('Failed to send mail', error);
      throw error;
    }
  }
}
