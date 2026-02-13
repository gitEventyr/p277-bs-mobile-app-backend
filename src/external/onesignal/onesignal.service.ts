import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  OneSignalNotificationRequest,
  OneSignalNotificationResponse,
  OneSignalErrorResponse,
  OneSignalUserResponse,
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
   * Create an email subscription for a user
   * @param visitorId - User's visitor ID (external_id)
   * @param email - Email address to subscribe
   * @returns Promise<boolean> - Returns true if successful, false if failed (non-blocking)
   */
  async createEmailSubscription(
    visitorId: string,
    email: string,
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        'OneSignal API is not configured. Skipping email subscription creation.',
      );
      return false;
    }

    try {
      const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}/subscriptions`;

      const payload = {
        subscription: {
          type: 'Email',
          token: email,
        },
      };

      this.logger.debug(
        `Creating email subscription for visitor ${visitorId}: ${email}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${this.apiKey}`,
          },
          timeout: 10000,
        }),
      );

      this.logger.log(
        `Successfully created email subscription for visitor ${visitorId}: ${email}`,
        {
          statusCode: response.status,
        },
      );

      return true;
    } catch (error) {
      // Non-blocking: log error but don't throw
      this.logger.error(
        `Failed to create email subscription for visitor ${visitorId}: ${email}`,
        {
          error: error.message,
          statusCode: error.response?.status,
          response: error.response?.data,
        },
      );
      return false;
    }
  }

  /**
   * Low-level API method to send a templated email
   * @param templateId - OneSignal template ID
   * @param visitorId - User's visitor ID (external_id)
   * @param emailSubject - Email subject line
   * @param customData - Template variables
   * @param email - Optional: specific email address to send to (creates subscription and links to user)
   */
  async sendTemplateEmail(
    templateId: string,
    visitorId: string,
    emailSubject: string,
    customData: Record<string, any>,
    email?: string,
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new BadRequestException('OneSignal API is not configured');
    }

    const payload: OneSignalNotificationRequest = {
      app_id: this.appId!,
      template_id: templateId,
      target_channel: 'email',
      email_subject: emailSubject,
      custom_data: customData,
    };

    // If email is provided, send to specific subscription ID to avoid sending to all subscriptions
    if (email) {
      this.logger.debug(
        `Finding email subscription for visitor ${visitorId}: ${email}`,
      );

      // Get user's current subscriptions
      const userData = await this.getUserSubscriptions(visitorId);

      // Find the subscription for the specific email
      const emailSubscription = userData?.subscriptions?.find(
        (sub) =>
          sub.type === 'Email' &&
          sub.token?.toLowerCase() === email.toLowerCase() &&
          sub.enabled,
      );

      if (emailSubscription) {
        this.logger.debug(
          `Sending to specific email subscription ID: ${emailSubscription.id} for ${email}`,
        );
        payload.include_subscription_ids = [emailSubscription.id];
      } else {
        // Subscription doesn't exist, create it first
        this.logger.debug(
          `Email subscription not found, creating for visitor ${visitorId}: ${email}`,
        );
        await this.createEmailSubscription(visitorId, email);

        // Retry fetching to get the new subscription ID
        const updatedUserData = await this.getUserSubscriptions(visitorId);
        const newEmailSubscription = updatedUserData?.subscriptions?.find(
          (sub) =>
            sub.type === 'Email' &&
            sub.token?.toLowerCase() === email.toLowerCase() &&
            sub.enabled,
        );

        if (newEmailSubscription) {
          this.logger.debug(
            `Sending to newly created email subscription ID: ${newEmailSubscription.id} for ${email}`,
          );
          payload.include_subscription_ids = [newEmailSubscription.id];
        } else {
          // Fallback: if we still can't find the subscription, use external_id
          this.logger.warn(
            `Could not find email subscription after creation, falling back to external_id for visitor ${visitorId}`,
          );
          payload.include_aliases = {
            external_id: [visitorId],
          };
        }
      }
    } else {
      // No specific email provided, use external_id (legacy behavior)
      this.logger.debug(`Sending email via external_id to visitor ${visitorId}`);
      payload.include_aliases = {
        external_id: [visitorId],
      };
    }

    await this.sendNotification(payload, 'email');
  }

  /**
   * Create an SMS subscription for a user
   * @param visitorId - User's visitor ID (external_id)
   * @param phoneNumber - Phone number to subscribe in E.164 format
   * @returns Promise<boolean> - Returns true if successful, false if failed (non-blocking)
   */
  async createSMSSubscription(
    visitorId: string,
    phoneNumber: string,
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        'OneSignal API is not configured. Skipping SMS subscription creation.',
      );
      return false;
    }

    try {
      const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}/subscriptions`;

      const payload = {
        subscription: {
          type: 'SMS',
          token: phoneNumber,
        },
      };

      this.logger.debug(
        `Creating SMS subscription for visitor ${visitorId}: ${phoneNumber}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${this.apiKey}`,
          },
          timeout: 10000,
        }),
      );

      this.logger.log(
        `Successfully created SMS subscription for visitor ${visitorId}: ${phoneNumber}`,
        {
          statusCode: response.status,
        },
      );

      return true;
    } catch (error) {
      // Non-blocking: log error but don't throw
      this.logger.error(
        `Failed to create SMS subscription for visitor ${visitorId}: ${phoneNumber}`,
        {
          error: error.message,
          statusCode: error.response?.status,
          response: error.response?.data,
        },
      );
      return false;
    }
  }

  /**
   * Low-level API method to send a templated SMS
   * @param templateId - OneSignal template ID
   * @param visitorId - User's visitor ID (external_id)
   * @param customData - Template variables
   * @param phoneNumber - Optional: specific phone number to send to in E.164 format (creates subscription and links to user)
   */
  async sendTemplateSMS(
    templateId: string,
    visitorId: string,
    customData: Record<string, any>,
    phoneNumber?: string,
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new BadRequestException('OneSignal API is not configured');
    }

    const payload: OneSignalNotificationRequest = {
      app_id: this.appId!,
      template_id: templateId,
      target_channel: 'sms',
      custom_data: customData,
      // Note: contents field may be required by OneSignal API even when using templates
      // The template will override this placeholder content
      // contents: { en: 'SMS notification' },
    };

    // If phoneNumber is provided, send to specific subscription ID to avoid sending to all subscriptions
    if (phoneNumber) {
      this.logger.debug(
        `Finding SMS subscription for visitor ${visitorId}: ${phoneNumber}`,
      );

      // Get user's current subscriptions
      const userData = await this.getUserSubscriptions(visitorId);

      // Find the subscription for the specific phone number
      const smsSubscription = userData?.subscriptions?.find(
        (sub) =>
          sub.type === 'SMS' &&
          sub.token === phoneNumber &&
          sub.enabled,
      );

      if (smsSubscription) {
        this.logger.debug(
          `Sending to specific SMS subscription ID: ${smsSubscription.id} for ${phoneNumber}`,
        );
        payload.include_subscription_ids = [smsSubscription.id];
      } else {
        // Subscription doesn't exist, create it first
        this.logger.debug(
          `SMS subscription not found, creating for visitor ${visitorId}: ${phoneNumber}`,
        );
        await this.createSMSSubscription(visitorId, phoneNumber);

        // Retry fetching to get the new subscription ID
        const updatedUserData = await this.getUserSubscriptions(visitorId);
        const newSmsSubscription = updatedUserData?.subscriptions?.find(
          (sub) =>
            sub.type === 'SMS' &&
            sub.token === phoneNumber &&
            sub.enabled,
        );

        if (newSmsSubscription) {
          this.logger.debug(
            `Sending to newly created SMS subscription ID: ${newSmsSubscription.id} for ${phoneNumber}`,
          );
          payload.include_subscription_ids = [newSmsSubscription.id];
        } else {
          // Fallback: if we still can't find the subscription, use external_id
          this.logger.warn(
            `Could not find SMS subscription after creation, falling back to external_id for visitor ${visitorId}`,
          );
          payload.include_aliases = {
            external_id: [visitorId],
          };
        }
      }
    } else {
      // No specific phone number provided, use external_id (legacy behavior)
      this.logger.debug(`Sending SMS via external_id to visitor ${visitorId}`);
      payload.include_aliases = {
        external_id: [visitorId],
      };
    }

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
      email,
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
      email,
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

    await this.sendTemplateSMS(
      templateId,
      visitorId,
      {
        verification_code: verificationCode,
      },
      phoneNumber,
    );
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
      this.logger.warn('OneSignal API is not configured. Skipping tag update.');
      return false;
    }

    try {
      const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}`;

      const payload = {
        properties: {
          tags,
        },
      };

      this.logger.debug(`Updating OneSignal tags for visitor ${visitorId}`, {
        tagCount: Object.keys(tags).length,
        tags,
      });

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
   * Get user information including all subscriptions
   * @param visitorId - The visitor ID (external_id in OneSignal)
   * @returns User data including subscriptions, or null if user not found
   */
  async getUserSubscriptions(
    visitorId: string,
  ): Promise<OneSignalUserResponse | null> {
    if (!this.isConfigured()) {
      this.logger.warn(
        'OneSignal API is not configured. Cannot fetch user subscriptions.',
      );
      return null;
    }

    try {
      const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}`;

      this.logger.debug(
        `Fetching OneSignal subscriptions for visitor ${visitorId}`,
      );

      const response = await firstValueFrom(
        this.httpService.get<OneSignalUserResponse>(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${this.apiKey}`,
          },
          timeout: 10000,
        }),
      );

      this.logger.log(
        `Successfully fetched OneSignal user data for visitor ${visitorId}`,
        {
          subscriptionCount: response.data.subscriptions?.length || 0,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        this.logger.warn(`User not found in OneSignal: visitor ${visitorId}`);
        return null;
      }

      this.logger.error(
        `Failed to fetch OneSignal subscriptions for visitor ${visitorId}`,
        {
          error: error.message,
          statusCode: error.response?.status,
          response: error.response?.data,
        },
      );
      return null;
    }
  }

  /**
   * Disable a subscription by its token (email address or phone number)
   * @param tokenType - The subscription type ('Email' or 'SMS')
   * @param token - The email address or phone number
   * @returns Promise<boolean> - Returns true if successful, false if failed (non-blocking)
   */
  async disableSubscription(
    tokenType: 'Email' | 'SMS',
    token: string,
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        'OneSignal API is not configured. Skipping subscription disable.',
      );
      return false;
    }

    try {
      const apiUrl = `https://api.onesignal.com/apps/${this.appId}/subscriptions_by_token/${tokenType}/${encodeURIComponent(token)}`;

      const payload = {
        subscription: {
          enabled: false,
          notification_types: -31, // Unsubscribed status per OneSignal docs
        },
      };

      this.logger.debug(
        `Disabling OneSignal ${tokenType} subscription for: ${token}`,
      );

      const response = await firstValueFrom(
        this.httpService.patch(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${this.apiKey}`,
          },
          timeout: 10000,
        }),
      );

      this.logger.log(
        `Successfully disabled OneSignal ${tokenType} subscription for: ${token}`,
        {
          statusCode: response.status,
        },
      );

      return true;
    } catch (error) {
      // Non-blocking: log error but don't throw
      // The subscription might not exist, which is fine
      if (error.response?.status === 404) {
        this.logger.debug(
          `Subscription not found in OneSignal (may not exist yet): ${tokenType} ${token}`,
        );
        return false;
      }

      this.logger.error(
        `Failed to disable OneSignal ${tokenType} subscription for: ${token}`,
        {
          error: error.message,
          statusCode: error.response?.status,
          response: error.response?.data,
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
          recipient_count: payload.include_subscription_ids
            ? payload.include_subscription_ids.length
            : payload.include_aliases
              ? payload.include_aliases.external_id.length
              : payload.include_email_tokens
                ? payload.include_email_tokens.length
                : payload.include_phone_numbers
                  ? payload.include_phone_numbers.length
                  : 0,
          targeting_method: payload.include_subscription_ids
            ? 'subscription_ids'
            : payload.include_email_tokens
              ? 'email_tokens'
              : payload.include_phone_numbers
                ? 'phone_numbers'
                : 'external_id',
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
