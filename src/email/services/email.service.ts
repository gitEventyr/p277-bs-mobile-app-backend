import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailOptions,
  EmailProvider,
  EmailTemplateType,
  EmailTemplateData,
} from '../interfaces/email.interface';
import { EmailTemplateService } from './email-template.service';
import { AWSSESProvider } from './aws-ses.provider';
import { SMTPProvider } from './smtp.provider';
import { SendGridProvider } from './sendgrid.provider';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private emailProvider: EmailProvider;

  constructor(
    private configService: ConfigService,
    private templateService: EmailTemplateService,
    private awsSESProvider: AWSSESProvider,
    private smtpProvider: SMTPProvider,
    private sendGridProvider: SendGridProvider,
  ) {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    const provider = this.configService.get<string>('EMAIL_PROVIDER', 'smtp');

    switch (provider.toLowerCase()) {
      case 'aws':
      case 'ses':
        this.emailProvider = this.awsSESProvider;
        this.logger.log('Using AWS SES email provider');
        break;
      case 'sendgrid':
        this.emailProvider = this.sendGridProvider;
        this.logger.log('Using SendGrid email provider');
        break;
      case 'smtp':
      default:
        this.emailProvider = this.smtpProvider;
        this.logger.log('Using SMTP email provider');
        break;
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.emailProvider.sendEmail(options);
      this.logger.log(
        `Email sent successfully to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
      );
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendTemplatedEmail(
    type: EmailTemplateType,
    to: string | string[],
    data: EmailTemplateData,
    options?: Partial<EmailOptions>,
  ): Promise<void> {
    const template = this.templateService.renderTemplate(type, data);

    if (!template) {
      throw new Error(`Failed to render email template: ${type}`);
    }

    const emailOptions: EmailOptions = {
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      ...options,
    };

    await this.sendEmail(emailOptions);
  }

  async sendDynamicTemplateEmail(
    templateId: string,
    to: string | string[],
    dynamicTemplateData: Record<string, any>,
    options?: Partial<EmailOptions>,
  ): Promise<void> {
    try {
      // Check if the provider supports dynamic templates directly
      if (this.emailProvider.sendTemplateEmail) {
        await this.emailProvider.sendTemplateEmail(
          templateId,
          to,
          dynamicTemplateData,
          options,
        );
      } else {
        // Fallback for providers that don't support dynamic templates
        throw new Error(
          `Dynamic templates not supported by current email provider`,
        );
      }

      this.logger.log(
        `Dynamic template email sent successfully to: ${Array.isArray(to) ? to.join(', ') : to} using template: ${templateId}`,
      );
    } catch (error) {
      this.logger.error('Failed to send dynamic template email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(
    to: string,
    userData: {
      name?: string;
      email: string;
      coinsBalance: number;
      ipAddress: string;
      loginUrl?: string;
    },
  ): Promise<void> {
    const data = {
      name: userData.name || 'Player',
      email: userData.email,
      coinsBalance: userData.coinsBalance,
      ipAddress: userData.ipAddress,
      loginUrl:
        userData.loginUrl ||
        this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    };

    await this.sendTemplatedEmail(EmailTemplateType.WELCOME, to, data);
  }

  async sendEmailVerification(
    to: string,
    userData: {
      name?: string;
      verificationUrl: string;
    },
  ): Promise<void> {
    const data = {
      name: userData.name || 'Player',
      verificationUrl: userData.verificationUrl,
    };

    await this.sendTemplatedEmail(
      EmailTemplateType.EMAIL_VERIFICATION,
      to,
      data,
    );
  }

  async sendPasswordReset(
    to: string,
    userData: {
      name?: string;
      resetUrl: string;
    },
  ): Promise<void> {
    const data = {
      name: userData.name || 'Player',
      resetUrl: userData.resetUrl,
    };

    await this.sendTemplatedEmail(EmailTemplateType.PASSWORD_RESET, to, data);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      return await this.emailProvider.verifyConnection();
    } catch (error) {
      this.logger.error(
        'Email provider connection verification failed:',
        error,
      );
      return false;
    }
  }

  async healthCheck(): Promise<{
    status: string;
    provider: string;
    connected: boolean;
  }> {
    const providerName = this.configService.get<string>(
      'EMAIL_PROVIDER',
      'smtp',
    );
    const connected = await this.verifyConnection();

    return {
      status: connected ? 'healthy' : 'unhealthy',
      provider: providerName,
      connected,
    };
  }
}
