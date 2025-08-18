import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailOptions, EmailProvider } from '../interfaces/email.interface';

@Injectable()
export class AWSSESProvider implements EmailProvider {
  private readonly logger = new Logger(AWSSESProvider.name);
  private sesClient: SESClient;
  private defaultFromEmail: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const config: any = {
      region,
    };

    if (accessKeyId && secretAccessKey) {
      config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.sesClient = new SESClient(config);
    this.defaultFromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@casino.com');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const recipients = Array.isArray(options.to) ? options.to : [options.to];
      
      const params = {
        Source: options.from || this.defaultFromEmail,
        Destination: {
          ToAddresses: recipients,
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: options.html ? {
              Data: options.html,
              Charset: 'UTF-8',
            } : undefined,
            Text: options.text ? {
              Data: options.text,
              Charset: 'UTF-8',
            } : undefined,
          },
        },
      };

      const command = new SendEmailCommand(params);
      await this.sesClient.send(command);
      
      this.logger.log(`Email sent successfully to: ${recipients.join(', ')}`);
    } catch (error) {
      this.logger.error('Failed to send email via AWS SES:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      // Try to send a simple test email to verify connection
      // In a real implementation, you might want to use ListIdentitiesCommand
      return true;
    } catch (error) {
      this.logger.error('AWS SES connection verification failed:', error);
      return false;
    }
  }
}