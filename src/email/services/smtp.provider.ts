import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailOptions, EmailProvider } from '../interfaces/email.interface';

@Injectable()
export class SMTPProvider implements EmailProvider {
  private readonly logger = new Logger(SMTPProvider.name);
  private transporter: nodemailer.Transporter;
  private defaultFromEmail: string;

  constructor(private configService: ConfigService) {
    this.defaultFromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@casino.com');
    this.createTransporter();
  }

  private createTransporter(): void {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const secure = this.configService.get<boolean>('SMTP_SECURE', false);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (!host) {
      // For development/testing - use ethereal email
      this.logger.warn('No SMTP configuration found, using Ethereal for testing');
      this.createTestTransporter();
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? {
        user,
        pass,
      } : undefined,
    });
  }

  private async createTestTransporter(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log(`Test email account created: ${testAccount.user}`);
    } catch (error) {
      this.logger.error('Failed to create test email account:', error);
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || this.defaultFromEmail,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent successfully to: ${mailOptions.to}`);
      
      // For testing with Ethereal, log the preview URL
      if (nodemailer.getTestMessageUrl(info)) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error('Failed to send email via SMTP:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('SMTP connection verification failed:', error);
      return false;
    }
  }
}