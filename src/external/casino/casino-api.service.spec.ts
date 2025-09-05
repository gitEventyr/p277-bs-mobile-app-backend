import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { CasinoApiService } from './casino-api.service';
import { RegisterDto } from '../../auth/dto/register.dto';

describe('CasinoApiService', () => {
  let service: CasinoApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    // Set up default mock configuration
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        CASINO_API_URL: 'https://stg.bonusandspins.com',
        CASINO_API_BEARER_TOKEN: 'test-bearer-token',
        CASINO_API_APP_ID: '3',
      };
      return config[key];
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasinoApiService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CasinoApiService>(CasinoApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isConfigured', () => {
    it('should return true when all config values are present', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const config = {
          CASINO_API_URL: 'https://test.api.com',
          CASINO_API_BEARER_TOKEN: 'test-token',
          CASINO_API_APP_ID: '123',
        };
        return config[key];
      });

      // Create a new instance to test configuration
      const testService = new CasinoApiService(configService, httpService);
      expect(testService.isConfigured()).toBe(true);
    });

    it('should return false when config values are missing', () => {
      mockConfigService.get.mockReturnValue(undefined);

      const testService = new CasinoApiService(configService, httpService);
      expect(testService.isConfigured()).toBe(false);
    });
  });

  describe('registerUser', () => {
    const mockRegisterDto: RegisterDto = {
      name: 'John Doe',
      email: 'john@example.com',
      deviceUDID: 'device-123',
      subscription_agreement: true,
      tnc_agreement: true,
      os: 'iOS',
      device: 'iPhone 14',
      appsflyer: {
        pid: 'test-pid',
        c: 'test-campaign',
        af_channel: 'google',
      },
    };

    it('should successfully register user and return visitor_id', async () => {
      const mockResponse = {
        data: { 
          user: {
            created: true,
            visitor_id: 'visitor_12345'
          }
        },
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.registerUser(mockRegisterDto, '192.168.1.1');

      expect(result).toBe('visitor_12345');
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://stg.bonusandspins.com/api/mobile/v1/3/register',
        {
          firstname: 'John Doe',
          email: 'john@example.com',
          device_udid: 'device-123',
          subscription_agreement: true,
          tnc_agreement: true,
          os: 'iOS',
          device: 'iPhone 14',
          ipaddress: '192.168.1.1',
          appsflyer: {
            pid: 'test-pid',
            c: 'test-campaign',
            af_channel: 'google',
            af_adset: '',
            af_ad: '',
            af_keywords: '',
            is_retargeting: false,
            af_click_lookback: '',
            af_viewthrough_lookback: '',
            af_sub1: '',
            af_sub2: '',
            af_sub3: '',
            af_sub4: '',
            af_sub5: '',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-bearer-token',
          },
          timeout: 10000,
        },
      );
    });

    it('should handle missing visitor_id in response', async () => {
      const mockResponse = {
        data: { some_other_field: 'value' },
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await expect(
        service.registerUser(mockRegisterDto, '192.168.1.1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle HTTP errors from casino API', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid request' },
        },
        message: 'Bad Request',
      };

      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(
        service.registerUser(mockRegisterDto, '192.168.1.1'),
      ).rejects.toThrow('Casino API error: Invalid request');
    });

    it('should handle network errors', async () => {
      const error = {
        message: 'Network Error',
        response: undefined,
      };

      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(
        service.registerUser(mockRegisterDto, '192.168.1.1'),
      ).rejects.toThrow(
        'Unable to complete registration. Please try again later.',
      );
    });

    it('should throw error when not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);
      const unconfiguredService = new CasinoApiService(
        configService,
        httpService,
      );

      await expect(
        unconfiguredService.registerUser(mockRegisterDto, '192.168.1.1'),
      ).rejects.toThrow('Casino API is not configured');
    });

    it('should handle empty RegisterDto values gracefully', async () => {
      const emptyRegisterDto: RegisterDto = {};
      const mockResponse = {
        data: { 
          user: {
            created: false,
            visitor_id: 'visitor_empty_test'
          }
        },
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.registerUser(emptyRegisterDto, '127.0.0.1');

      expect(result).toBe('visitor_empty_test');
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://stg.bonusandspins.com/api/mobile/v1/3/register',
        {
          firstname: '',
          email: '',
          device_udid: '',
          subscription_agreement: false,
          tnc_agreement: false,
          os: '',
          device: '',
          ipaddress: '127.0.0.1',
          appsflyer: {
            pid: '',
            c: '',
            af_channel: '',
            af_adset: '',
            af_ad: '',
            af_keywords: '',
            is_retargeting: false,
            af_click_lookback: '',
            af_viewthrough_lookback: '',
            af_sub1: '',
            af_sub2: '',
            af_sub3: '',
            af_sub4: '',
            af_sub5: '',
          },
        },
        expect.any(Object),
      );
    });
  });
});
