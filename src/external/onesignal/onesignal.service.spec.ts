import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { OneSignalService } from './onesignal.service';
import {
  OneSignalNotificationResponse,
  OneSignalErrorResponse,
} from './interfaces/onesignal.interface';

describe('OneSignalService', () => {
  let service: OneSignalService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config = {
        ONE_SIGNAL_APP_ID: 'test-app-id',
        ONE_SIGNAL_API_KEY: 'test-api-key-1234567890',
        EMAIL_PASSWORD_RESET_TEMPLATE_ID: 'reset-template-id',
        EMAIL_VALIDATION_OTP_TEMPLATE_ID: 'email-otp-template-id',
        SMS_BONUS_SPINS_OTP_TEMPLATE_ID: 'sms-otp-template-id',
      };
      return config[key] || defaultValue;
    }),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    // Reset mock implementation to default values
    mockConfigService.get.mockImplementation((key: string, defaultValue?: string) => {
      const config = {
        ONE_SIGNAL_APP_ID: 'test-app-id',
        ONE_SIGNAL_API_KEY: 'test-api-key-1234567890',
        EMAIL_PASSWORD_RESET_TEMPLATE_ID: 'reset-template-id',
        EMAIL_VALIDATION_OTP_TEMPLATE_ID: 'email-otp-template-id',
        SMS_BONUS_SPINS_OTP_TEMPLATE_ID: 'sms-otp-template-id',
      };
      return config[key] || defaultValue;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OneSignalService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<OneSignalService>(OneSignalService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should log warning if configuration is incomplete', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      // Spy on console.warn or Logger.warn before creating the service
      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OneSignalService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();

      const newService = module.get<OneSignalService>(OneSignalService);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'OneSignal API configuration is incomplete. OneSignal notifications will be disabled.',
      );

      loggerWarnSpy.mockRestore();
    });
  });

  describe('isConfigured', () => {
    it('should return true when API key and App ID are configured', () => {
      expect(service.isConfigured()).toBe(true);
    });

    it('should return false when configuration is missing', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OneSignalService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();

      const newService = module.get<OneSignalService>(OneSignalService);

      expect(newService.isConfigured()).toBe(false);
    });
  });

  describe('verifyConnection', () => {
    it('should return true when configured', async () => {
      const result = await service.verifyConnection();
      expect(result).toBe(true);
    });

    it('should return false when not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OneSignalService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();

      const newService = module.get<OneSignalService>(OneSignalService);

      const result = await newService.verifyConnection();
      expect(result).toBe(false);
    });
  });

  describe('sendTemplateEmail', () => {
    it('should send email successfully', async () => {
      const mockResponse: AxiosResponse<OneSignalNotificationResponse> = {
        data: {
          id: 'notification-id-123',
          recipients: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.sendTemplateEmail('template-id', 'test@example.com', {
        key: 'value',
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: 'test-app-id',
          template_id: 'template-id',
          include_aliases: {
            external_id: ['test@example.com'],
          },
          target_channel: 'email',
          custom_data: { key: 'value' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-api-key-1234567890',
          },
          timeout: 10000,
        },
      );
    });

    it('should throw error when not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OneSignalService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();

      const newService = module.get<OneSignalService>(OneSignalService);

      await expect(
        newService.sendTemplateEmail('template-id', 'test@example.com', {}),
      ).rejects.toThrow('OneSignal API is not configured');
    });

    it('should handle OneSignal API error response', async () => {
      const mockErrorResponse: AxiosResponse<OneSignalErrorResponse> = {
        data: {
          errors: ['Invalid template ID', 'Invalid email'],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockErrorResponse));

      await expect(
        service.sendTemplateEmail('invalid-template', 'test@example.com', {}),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.sendTemplateEmail('invalid-template', 'test@example.com', {}),
      ).rejects.toThrow('OneSignal API error: Invalid template ID, Invalid email');
    });

    it('should handle HTTP 4xx errors', async () => {
      const error = {
        response: {
          status: 400,
          data: {
            errors: ['Bad request'],
          },
        },
        message: 'Request failed',
      } as AxiosError;

      mockHttpService.post.mockReturnValue(
        throwError(() => error),
      );

      await expect(
        service.sendTemplateEmail('template-id', 'test@example.com', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle HTTP 5xx errors', async () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Internal server error',
      } as AxiosError;

      mockHttpService.post.mockReturnValue(
        throwError(() => error),
      );

      await expect(
        service.sendTemplateEmail('template-id', 'test@example.com', {}),
      ).rejects.toThrow('Unable to send email notification. Please try again later.');
    });
  });

  describe('sendTemplateSMS', () => {
    it('should send SMS successfully', async () => {
      const mockResponse: AxiosResponse<OneSignalNotificationResponse> = {
        data: {
          id: 'notification-id-456',
          recipients: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.sendTemplateSMS('template-id', '+1234567890', {
        code: '123456',
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: 'test-app-id',
          template_id: 'template-id',
          include_aliases: {
            external_id: ['+1234567890'],
          },
          target_channel: 'sms',
          custom_data: { code: '123456' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-api-key-1234567890',
          },
          timeout: 10000,
        },
      );
    });

    it('should throw error when not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OneSignalService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: HttpService, useValue: mockHttpService },
        ],
      }).compile();

      const newService = module.get<OneSignalService>(OneSignalService);

      await expect(
        newService.sendTemplateSMS('template-id', '+1234567890', {}),
      ).rejects.toThrow('OneSignal API is not configured');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct template', async () => {
      const mockResponse: AxiosResponse<OneSignalNotificationResponse> = {
        data: {
          id: 'notification-id-789',
          recipients: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.sendPasswordResetEmail(
        'user@example.com',
        'https://example.com/reset?token=abc123',
      );

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://onesignal.com/api/v1/notifications',
        expect.objectContaining({
          template_id: 'reset-template-id',
          include_aliases: {
            external_id: ['user@example.com'],
          },
          target_channel: 'email',
          custom_data: {
            reset_link: 'https://example.com/reset?token=abc123',
          },
        }),
        expect.any(Object),
      );
    });

    it('should throw error when template ID is not configured', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_PASSWORD_RESET_TEMPLATE_ID') {
          return undefined;
        }
        return 'test-value';
      });

      await expect(
        service.sendPasswordResetEmail('user@example.com', 'https://reset.link'),
      ).rejects.toThrow('EMAIL_PASSWORD_RESET_TEMPLATE_ID is not configured');
    });
  });

  describe('sendEmailVerificationCode', () => {
    it('should send email verification code with correct template', async () => {
      const mockResponse: AxiosResponse<OneSignalNotificationResponse> = {
        data: {
          id: 'notification-id-101',
          recipients: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.sendEmailVerificationCode('user@example.com', '654321');

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://onesignal.com/api/v1/notifications',
        expect.objectContaining({
          template_id: 'email-otp-template-id',
          include_aliases: {
            external_id: ['user@example.com'],
          },
          target_channel: 'email',
          custom_data: {
            verification_code: '654321',
          },
        }),
        expect.any(Object),
      );
    });

    it('should throw error when template ID is not configured', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'EMAIL_VALIDATION_OTP_TEMPLATE_ID') {
          return undefined;
        }
        return 'test-value';
      });

      await expect(
        service.sendEmailVerificationCode('user@example.com', '123456'),
      ).rejects.toThrow('EMAIL_VALIDATION_OTP_TEMPLATE_ID is not configured');
    });
  });

  describe('sendPhoneVerificationCode', () => {
    it('should send phone verification code with correct template', async () => {
      const mockResponse: AxiosResponse<OneSignalNotificationResponse> = {
        data: {
          id: 'notification-id-202',
          recipients: 1,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.sendPhoneVerificationCode('+1234567890', '789012');

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://onesignal.com/api/v1/notifications',
        expect.objectContaining({
          template_id: 'sms-otp-template-id',
          include_aliases: {
            external_id: ['+1234567890'],
          },
          target_channel: 'sms',
          custom_data: {
            verification_code: '789012',
          },
        }),
        expect.any(Object),
      );
    });

    it('should throw error when template ID is not configured', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'SMS_BONUS_SPINS_OTP_TEMPLATE_ID') {
          return undefined;
        }
        return 'test-value';
      });

      await expect(
        service.sendPhoneVerificationCode('+1234567890', '123456'),
      ).rejects.toThrow('SMS_BONUS_SPINS_OTP_TEMPLATE_ID is not configured');
    });
  });
});
