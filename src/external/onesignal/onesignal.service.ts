import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  OneSignalNotificationRequest,
  OneSignalNotificationResponse,
  OneSignalErrorResponse,
} from './interfaces/onesignal.interface';

@Injectable()
export class OneSignalService {
  private readonly logger = new Logger(OneSignalService.name);
  private readonly apiBaseUrl = 'https://api.onesignal.com/notifications';
  private readonly appId: string | undefined;
  private readonly apiKey: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.appId = this.configService.get<string>('ONE_SIGNAL_APP_ID');
    this.apiKey = this.configService.get<string>('ONE_SIGNAL_API_KEY');

    if (!this.appId || !this.apiKey) {
      this.logger.warn(
        'OneSignal API configuration is incomplete. OneSignal notifications will be disabled.',
      );
    }
  }

  /**
   * Low-level API method to send a templated email
   */
  async sendTemplateEmail(
    templateId: string,
    visitorId: string,
    emailSubject: string,
    customData: Record<string, any>,
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new BadRequestException('OneSignal API is not configured');
    }

    const payload: OneSignalNotificationRequest = {
      app_id: this.appId!,
      template_id: templateId,
      include_aliases: {
        external_id: [visitorId],
      },
      target_channel: 'email',
      email_subject: emailSubject,
      custom_data: customData,
    };

    await this.sendNotification(payload, 'email');
  }

  /**
   * Low-level API method to send a templated SMS
   */
  async sendTemplateSMS(
    templateId: string,
    visitorId: string,
    customData: Record<string, any>,
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new BadRequestException('OneSignal API is not configured');
    }

    const payload: OneSignalNotificationRequest = {
      app_id: this.appId!,
      template_id: templateId,
      include_aliases: {
        external_id: [visitorId],
      },
      target_channel: 'sms',
      custom_data: customData,
      // Note: contents field may be required by OneSignal API even when using templates
      // The template will override this placeholder content
      contents: { en: 'SMS notification' },
    };

    await this.sendNotification(payload, 'SMS');
  }

  /**
   * High-level business method to send password reset email
   */
  async sendPasswordResetEmail(
    visitorId: string,
    resetLink: string,
    email?: string,
  ): Promise<void> {
    const templateId = this.configService.get<string>(
      'EMAIL_PASSWORD_RESET_TEMPLATE_ID',
    );

    if (!templateId) {
      throw new BadRequestException(
        'EMAIL_PASSWORD_RESET_TEMPLATE_ID is not configured',
      );
    }

    this.logger.log(
      `Sending password reset email to visitor ${visitorId}${email ? ` (${email})` : ''}`,
    );

    await this.sendTemplateEmail(
      templateId,
      visitorId,
      'Reset Your Password',
      {
        reset_link: resetLink,
      },
    );
  }

  /**
   * High-level business method to send email verification code
   */
  async sendEmailVerificationCode(
    visitorId: string,
    verificationCode: string,
    email?: string,
  ): Promise<void> {
    const templateId = this.configService.get<string>(
      'EMAIL_VALIDATION_OTP_TEMPLATE_ID',
    );

    if (!templateId) {
      throw new BadRequestException(
        'EMAIL_VALIDATION_OTP_TEMPLATE_ID is not configured',
      );
    }

    this.logger.log(
      `Sending email verification code to visitor ${visitorId}${email ? ` (${email})` : ''}`,
    );

    await this.sendTemplateEmail(
      templateId,
      visitorId,
      'Verify Your Email Address',
      {
        verification_code: verificationCode,
      },
    );
  }

  /**
   * High-level business method to send phone verification code
   */
  async sendPhoneVerificationCode(
    visitorId: string,
    verificationCode: string,
    phoneNumber?: string,
  ): Promise<void> {
    const templateId = this.configService.get<string>(
      'SMS_BONUS_SPINS_OTP_TEMPLATE_ID',
    );

    if (!templateId) {
      throw new BadRequestException(
        'SMS_BONUS_SPINS_OTP_TEMPLATE_ID is not configured',
      );
    }

    this.logger.log(
      `Sending phone verification code to visitor ${visitorId}${phoneNumber ? ` (${phoneNumber})` : ''}`,
    );

    await this.sendTemplateSMS(templateId, visitorId, {
      verification_code: verificationCode,
    });
  }

  /**
   * Update user tags in OneSignal
   * @param visitorId - The visitor ID (external_id in OneSignal)
   * @param tags - Key-value pairs of tags to update (all values must be strings)
   * @returns Promise<boolean> - Returns true if successful, false if failed (non-blocking)
   */
  async updateUserTags(
    visitorId: string,
    tags: Record<string, string>,
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        'OneSignal API is not configured. Skipping tag update.',
      );
      return false;
    }

    try {
      const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}`;

      const payload = {
        properties: {
          tags,
        },
      };

      this.logger.debug(
        `Updating OneSignal tags for visitor ${visitorId}`,
        {
          tagCount: Object.keys(tags).length,
          tags,
        },
      );

      const response = await firstValueFrom(
        this.httpService.patch(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${this.apiKey}`,
          },
          timeout: 10000, // 10 seconds timeout
        }),
      );

      this.logger.log(
        `Successfully updated OneSignal tags for visitor ${visitorId}`,
        {
          statusCode: response.status,
          tagCount: Object.keys(tags).length,
        },
      );

      return true;
    } catch (error) {
      // Non-blocking: log error but don't throw
      this.logger.error(
        `Failed to update OneSignal tags for visitor ${visitorId}`,
        {
          error: error.message,
          statusCode: error.response?.status,
          response: error.response?.data,
          tags,
        },
      );
      return false;
    }
  }

  /**
   * Verify OneSignal connection by checking configuration
   */
  async verifyConnection(): Promise<boolean> {
    return this.isConfigured();
  }

  /**
   * Check if OneSignal is properly configured
   */
  isConfigured(): boolean {
    return !!(this.appId && this.apiKey);
  }

  /**
   * Internal method to send notification to OneSignal API
   */
  private async sendNotification(
    payload: OneSignalNotificationRequest,
    type: string,
  ): Promise<void> {
    try {
      // Build API URL with channel query parameter
      const apiUrl = `${this.apiBaseUrl}?c=${payload.target_channel}`;

      // Only log first 10 chars of API key for security
      const maskedApiKey = this.apiKey
        ? `${this.apiKey.substring(0, 10)}...`
        : 'not configured';

      this.logger.debug(
        `Calling OneSignal API: ${apiUrl} (API Key: ${maskedApiKey})`,
        {
          template_id: payload.template_id,
          target_channel: payload.target_channel,
          recipient_count: payload.include_aliases.external_id.length,
        },
      );

      const response = await firstValueFrom(
        this.httpService.post<
          OneSignalNotificationResponse | OneSignalErrorResponse
        >(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${this.apiKey}`,
          },
          timeout: 10000, // 10 seconds timeout
        }),
      );

      const responseData = response.data;

      // Check for error response
      if ('errors' in responseData) {
        throw new BadRequestException(
          `OneSignal API error: ${responseData.errors.join(', ')}`,
        );
      }

      this.logger.log(
        `Successfully sent ${type} notification via OneSignal. Notification ID: ${responseData.id}`,
      );
    } catch (error) {
      // If it's already a BadRequestException we threw, re-throw it
      if (error instanceof BadRequestException) {
        this.logger.error(`Failed to send ${type} notification via OneSignal`, {
          error: error.message,
          template_id: payload.template_id,
          target_channel: payload.target_channel,
        });
        throw error;
      }

      this.logger.error(`Failed to send ${type} notification via OneSignal`, {
        error: error.message,
        template_id: payload.template_id,
        target_channel: payload.target_channel,
        response: error.response?.data,
      });

      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw new BadRequestException(
          `OneSignal API error: ${error.response?.data?.errors?.join(', ') || error.message}`,
        );
      }

      // For 5xx errors or network issues, throw a generic error
      throw new BadRequestException(
        `Unable to send ${type} notification. Please try again later.`,
      );
    }
  }
}
