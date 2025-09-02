import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: twilio.Twilio;
  private verifyServiceSid: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.verifyServiceSid = this.configService.get<string>(
      'TWILIO_VERIFY_SERVICE_SID',
      '',
    );

    if (!accountSid || !authToken || !this.verifyServiceSid) {
      this.logger.warn(
        'Twilio Verify credentials not configured - SMS functionality will be disabled',
      );
    } else {
      this.client = twilio(accountSid, authToken);
      this.logger.log('Twilio Verify service initialized');
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<void> {
    if (!this.client || !this.verifyServiceSid) {
      this.logger.warn(
        'Twilio Verify not configured - SMS verification not sent',
      );
      return;
    }

    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to: phoneNumber,
          channel: 'sms',
        });

      this.logger.log(
        `Verification code sent successfully to ${phoneNumber}, SID: ${verification.sid}, Status: ${verification.status}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification code to ${phoneNumber}:`,
        error,
      );
      throw new BadRequestException(
        'Failed to send verification code. Please check the phone number format.',
      );
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    if (!this.client || !this.verifyServiceSid) {
      this.logger.warn(
        'Twilio Verify not configured - code verification failed',
      );
      return false;
    }

    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: code,
        });

      this.logger.log(
        `Verification check for ${phoneNumber}: Status: ${verificationCheck.status}`,
      );
      return verificationCheck.status === 'approved';
    } catch (error) {
      this.logger.error(`Failed to verify code for ${phoneNumber}:`, error);
      return false;
    }
  }
}
