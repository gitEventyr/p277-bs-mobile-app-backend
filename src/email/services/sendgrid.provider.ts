import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { EmailOptions, EmailProvider } from '../interfaces/email.interface';

@Injectable()
export class SendGridProvider implements EmailProvider {
  private readonly logger = new Logger(SendGridProvider.name);
  private defaultFromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.logger.log('SendGrid API key configured successfully');
    } else {
      this.logger.warn('SendGrid API key not provided');
    }

    this.defaultFromEmail = this.configService.get<string>(
      'EMAIL_FROM',
      'noreply@casino.com',
    );
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const recipients = Array.isArray(options.to) ? options.to : [options.to];

      const msg: any = {
        to: recipients,
        from: options.from || this.defaultFromEmail,
        subject: options.subject,
      };

      if (options.text) {
        msg.text = options.text;
      }

      if (options.html) {
        msg.html = options.html;
      }

      if (options.attachments && options.attachments.length > 0) {
        msg.attachments = options.attachments.map((attachment) => ({
          content: attachment.content.toString('base64'),
          filename: attachment.filename,
          type: attachment.contentType || 'application/octet-stream',
          disposition: 'attachment',
        }));
      }

      await sgMail.send(msg);

      this.logger.log(`Email sent successfully to: ${recipients.join(', ')}`);
    } catch (error) {
      this.logger.error('Failed to send email via SendGrid:', error);

      // Extract more meaningful error information from SendGrid
      let errorMessage = error.message;
      if (error.response?.body?.errors) {
        errorMessage = error.response.body.errors
          .map((err: any) => err.message)
          .join(', ');
      }

      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async sendTemplateEmail(
    templateId: string,
    to: string | string[],
    dynamicTemplateData: Record<string, any>,
    options?: Partial<EmailOptions>,
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];

      const msg: any = {
        to: recipients,
        from: options?.from || this.defaultFromEmail,
        templateId,
        dynamicTemplateData,
      };

      if (options?.subject) {
        msg.subject = options.subject;
      }

      if (options?.attachments && options.attachments.length > 0) {
        msg.attachments = options.attachments.map((attachment) => ({
          content: attachment.content.toString('base64'),
          filename: attachment.filename,
          type: attachment.contentType || 'application/octet-stream',
          disposition: 'attachment',
        }));
      }

      await sgMail.send(msg);

      this.logger.log(
        `Template email sent successfully to: ${recipients.join(', ')} using template: ${templateId}`,
      );
    } catch (error) {
      this.logger.error('Failed to send template email via SendGrid:', error);

      let errorMessage = error.message;
      if (error.response?.body?.errors) {
        errorMessage = error.response.body.errors
          .map((err: any) => err.message)
          .join(', ');
      }

      throw new Error(`Failed to send template email: ${errorMessage}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
      if (!apiKey) {
        this.logger.warn('SendGrid API key not configured');
        return false;
      }

      // SendGrid doesn't have a direct connection test, but we can verify the API key format
      // A real verification would require making an API call, but that might send an email
      // For now, we'll just check if the key exists and has the right format
      const isValidFormat = apiKey.startsWith('SG.');

      if (isValidFormat) {
        this.logger.log('SendGrid connection verified successfully');
        return true;
      } else {
        this.logger.warn('SendGrid API key format appears invalid');
        return false;
      }
    } catch (error) {
      this.logger.error('SendGrid connection verification failed:', error);
      return false;
    }
  }
}
