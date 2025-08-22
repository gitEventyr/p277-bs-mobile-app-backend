import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { EmailTemplateService } from './services/email-template.service';
import { AWSSESProvider } from './services/aws-ses.provider';
import { SMTPProvider } from './services/smtp.provider';
import { SendGridProvider } from './services/sendgrid.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailTemplateService,
    AWSSESProvider,
    SMTPProvider,
    SendGridProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}
