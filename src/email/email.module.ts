import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { EmailTemplateService } from './services/email-template.service';
import { AWSSESProvider } from './services/aws-ses.provider';
import { SMTPProvider } from './services/smtp.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    EmailService,
    EmailTemplateService,
    AWSSESProvider,
    SMTPProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}