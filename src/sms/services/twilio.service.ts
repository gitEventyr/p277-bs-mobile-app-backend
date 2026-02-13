import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import twilio from 'twilio';
import { PhoneVerificationToken } from '../../entities/phone-verification-token.entity';
import { OneSignalService } from '../../external/onesignal/onesignal.service';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: twilio.Twilio;
  private verifyServiceSid: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PhoneVerificationToken)
    private readonly phoneVerificationTokenRepository: Repository<PhoneVerificationToken>,
    private readonly oneSignalService: OneSignalService,
  ) {
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

  async sendVerificationCode(
    phoneNumber: string,
    userId?: number,
    visitorId?: string,
  ): Promise<void> {
    const smsProvider = this.configService.get<string>(
      'SMS_PROVIDER',
      'twilio',
    );

    // Route to OneSignal if configured
    if (smsProvider.toLowerCase() === 'onesignal') {
      if (!userId) {
        throw new BadRequestException(
          'User ID is required for OneSignal SMS verification',
        );
      }

      if (!visitorId) {
        throw new BadRequestException(
          'Visitor ID is required for OneSignal SMS verification',
        );
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      // Store code in database with 10 minute expiration
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await this.phoneVerificationTokenRepository.save({
        token: verificationCode,
        user_id: userId,
        expires_at: expiresAt,
        used: false,
      });

      // Send via OneSignal
      try {
        await this.oneSignalService.sendPhoneVerificationCode(
          visitorId,
          verificationCode,
          phoneNumber,
        );
        this.logger.log(
          `OneSignal verification code sent successfully to visitor ${visitorId} (${phoneNumber})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send verification code via OneSignal to visitor ${visitorId} (${phoneNumber}):`,
          error,
        );
        throw new BadRequestException(
          'Failed to send verification code. Please try again later.',
        );
      }

      return;
    }

    // Use Twilio Verify (existing logic)
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

  async verifyCode(
    phoneNumber: string,
    code: string,
    userId?: number,
  ): Promise<boolean> {
    const smsProvider = this.configService.get<string>(
      'SMS_PROVIDER',
      'twilio',
    );

    // Route to database verification if using OneSignal
    if (smsProvider.toLowerCase() === 'onesignal') {
      if (!userId) {
        this.logger.error(
          'User ID is required for OneSignal code verification',
        );
        return false;
      }

      try {
        // Find the most recent unused, non-expired token for this user
        const token = await this.phoneVerificationTokenRepository.findOne({
          where: {
            user_id: userId,
            token: code,
            used: false,
          },
          order: {
            created_at: 'DESC',
          },
        });

        if (!token) {
          this.logger.log(
            `No matching verification token found for user ${userId}`,
          );
          return false;
        }

        // Check if token has expired
        if (new Date() > token.expires_at) {
          this.logger.log(`Verification token expired for user ${userId}`);
          return false;
        }

        // Mark token as used
        token.used = true;
        await this.phoneVerificationTokenRepository.save(token);

        this.logger.log(
          `Verification code successfully verified for ${phoneNumber} (OneSignal)`,
        );
        return true;
      } catch (error) {
        this.logger.error(
          `Failed to verify code for ${phoneNumber} (OneSignal):`,
          error,
        );
        return false;
      }
    }

    // Use Twilio Verify (existing logic)
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
