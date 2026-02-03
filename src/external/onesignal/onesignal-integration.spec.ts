import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { OneSignalService } from './onesignal.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('OneSignal Integration Test', () => {
  let service: OneSignalService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        ONE_SIGNAL_APP_ID: 'test-app-id-1234',
        ONE_SIGNAL_API_KEY: 'test-api-key-5678',
        EMAIL_PASSWORD_RESET_TEMPLATE_ID: 'email-reset-template-id',
        EMAIL_VALIDATION_OTP_TEMPLATE_ID: 'email-validation-template-id',
        SMS_BONUS_SPINS_OTP_TEMPLATE_ID: 'sms-otp-template-id',
      };
      return config[key] || defaultValue;
    }),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OneSignalService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<OneSignalService>(OneSignalService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  describe('Email - Password Reset', () => {
    it('should send password reset email with correct payload structure', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 'notification-123', recipients: 1 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const visitorId = 'visitor_abc123';
      const resetLink = 'https://example.com/reset?code=123456';
      const email = 'user@example.com';

      await service.sendPasswordResetEmail(visitorId, resetLink, email);

      // Verify HTTP call was made
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);

      // Verify URL
      const callUrl = mockHttpService.post.mock.calls[0][0];
      expect(callUrl).toBe('https://api.onesignal.com/notifications?c=email');

      // Verify payload
      const callPayload = mockHttpService.post.mock.calls[0][1];
      expect(callPayload).toEqual({
        app_id: 'test-app-id-1234',
        template_id: 'email-reset-template-id',
        include_aliases: {
          external_id: ['visitor_abc123'],
        },
        target_channel: 'email',
        email_subject: 'Reset Your Password',
        custom_data: {
          reset_link: resetLink,
        },
      });

      // Verify headers
      const callHeaders = mockHttpService.post.mock.calls[0][2].headers;
      expect(callHeaders).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Key test-api-key-5678',
      });
    });
  });

  describe('Email - Verification Code', () => {
    it('should send email verification with correct payload structure', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 'notification-456', recipients: 1 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const visitorId = 'visitor_xyz789';
      const verificationCode = '123456';
      const email = 'user@example.com';

      await service.sendEmailVerificationCode(
        visitorId,
        verificationCode,
        email,
      );

      // Verify HTTP call was made
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);

      // Verify URL
      const callUrl = mockHttpService.post.mock.calls[0][0];
      expect(callUrl).toBe('https://api.onesignal.com/notifications?c=email');

      // Verify payload
      const callPayload = mockHttpService.post.mock.calls[0][1];
      expect(callPayload).toEqual({
        app_id: 'test-app-id-1234',
        template_id: 'email-validation-template-id',
        include_aliases: {
          external_id: ['visitor_xyz789'],
        },
        target_channel: 'email',
        email_subject: 'Verify Your Email Address',
        custom_data: {
          verification_code: '123456',
        },
      });

      // Verify headers
      const callHeaders = mockHttpService.post.mock.calls[0][2].headers;
      expect(callHeaders).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Key test-api-key-5678',
      });
    });
  });

  describe('SMS - Phone Verification', () => {
    it('should send SMS verification with correct payload structure', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 'notification-789', recipients: 1 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const visitorId = 'visitor_sms123';
      const verificationCode = '654321';
      const phoneNumber = '+1234567890';

      await service.sendPhoneVerificationCode(
        visitorId,
        verificationCode,
        phoneNumber,
      );

      // Verify HTTP call was made
      expect(mockHttpService.post).toHaveBeenCalledTimes(1);

      // Verify URL
      const callUrl = mockHttpService.post.mock.calls[0][0];
      expect(callUrl).toBe('https://api.onesignal.com/notifications?c=sms');

      // Verify payload
      const callPayload = mockHttpService.post.mock.calls[0][1];
      expect(callPayload).toEqual({
        app_id: 'test-app-id-1234',
        template_id: 'sms-otp-template-id',
        include_aliases: {
          external_id: ['visitor_sms123'],
        },
        target_channel: 'sms',
        custom_data: {
          verification_code: '654321',
        },
        contents: { en: 'SMS notification' },
      });

      // Verify headers
      const callHeaders = mockHttpService.post.mock.calls[0][2].headers;
      expect(callHeaders).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Key test-api-key-5678',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle OneSignal API errors correctly', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            errors: ['Invalid external_id', 'Template not found'],
          },
        },
        message: 'Request failed',
      };

      mockHttpService.post.mockReturnValue(
        throwError(() => errorResponse),
      );

      const visitorId = 'visitor_error123';
      const resetLink = 'https://example.com/reset';

      await expect(
        service.sendPasswordResetEmail(visitorId, resetLink),
      ).rejects.toThrow('OneSignal API error: Invalid external_id, Template not found');
    });

    it('should throw error when OneSignal is not configured', async () => {
      // Create a new service instance with missing config
      const mockBadConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'ONE_SIGNAL_APP_ID') return undefined;
          if (key === 'ONE_SIGNAL_API_KEY') return undefined;
          if (key === 'EMAIL_PASSWORD_RESET_TEMPLATE_ID') return 'template-123'; // Template ID is configured
          return undefined;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OneSignalService,
          {
            provide: ConfigService,
            useValue: mockBadConfigService,
          },
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
        ],
      }).compile();

      const badService = module.get<OneSignalService>(OneSignalService);

      await expect(
        badService.sendPasswordResetEmail('visitor_123', 'http://reset.com'),
      ).rejects.toThrow('OneSignal API is not configured');
    });
  });

  describe('Configuration Check', () => {
    it('should verify if OneSignal is configured', () => {
      expect(service.isConfigured()).toBe(true);
    });

    it('should verify connection returns true when configured', async () => {
      const result = await service.verifyConnection();
      expect(result).toBe(true);
    });
  });
});
