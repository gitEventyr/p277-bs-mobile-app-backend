import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from '../../auth/dto/register.dto';

export interface CasinoApiRegisterRequest {
  firstname: string;
  email: string;
  device_udid: string;
  subscription_agreement: boolean;
  tnc_agreement: boolean;
  os: string;
  device: string;
  ipaddress: string;
  // AppsFlyer fields nested as expected by external API
  appsflyer: {
    pid?: string;
    c?: string;
    af_channel?: string;
    af_adset?: string;
    af_ad?: string;
    af_keywords?: string;
    is_retargeting?: boolean;
    af_click_lookback?: string;
    af_viewthrough_lookback?: string;
    af_sub1?: string;
    af_sub2?: string;
    af_sub3?: string;
    af_sub4?: string;
    af_sub5?: string;
  };
}

export interface CasinoApiRegisterResponse {
  visitor_id?: string;
  user?: {
    visitor_id: string;
  };
}

@Injectable()
export class CasinoApiService {
  private readonly logger = new Logger(CasinoApiService.name);
  private readonly casinoApiUrl: string | undefined;
  private readonly casinoBearerToken: string | undefined;
  private readonly casinoAppId: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.casinoApiUrl = this.configService.get<string>('CASINO_API_URL');
    this.casinoBearerToken = this.configService.get<string>(
      'CASINO_API_BEARER_TOKEN',
    );
    this.casinoAppId = this.configService.get<string>('CASINO_API_APP_ID');

    if (!this.casinoApiUrl || !this.casinoBearerToken || !this.casinoAppId) {
      this.logger.warn(
        'Casino API configuration is incomplete. External registration will be disabled.',
      );
    }
  }

  async registerUser(
    registerDto: RegisterDto,
    ipAddress: string,
  ): Promise<string> {
    if (!this.casinoApiUrl || !this.casinoBearerToken || !this.casinoAppId) {
      throw new BadRequestException('Casino API is not configured');
    }

    const registerPayload: CasinoApiRegisterRequest = {
      firstname: registerDto.name || '',
      email: registerDto.email || '',
      device_udid: registerDto.deviceUDID || '',
      subscription_agreement: registerDto.subscription_agreement || false,
      tnc_agreement: registerDto.tnc_agreement || false,
      os: registerDto.os || '',
      device: registerDto.device || '',
      ipaddress: ipAddress,
      // AppsFlyer fields nested as expected by external API
      appsflyer: {
        pid: registerDto.appsflyer?.pid || '',
        c: registerDto.appsflyer?.c || '',
        af_channel: registerDto.appsflyer?.af_channel || '',
        af_adset: registerDto.appsflyer?.af_adset || '',
        af_ad: registerDto.appsflyer?.af_ad || '',
        af_keywords: registerDto.appsflyer?.af_keywords || '',
        is_retargeting: registerDto.appsflyer?.is_retargeting || false,
        af_click_lookback:
          registerDto.appsflyer?.af_click_lookback?.toString() || '',
        af_viewthrough_lookback:
          registerDto.appsflyer?.af_viewthrough_lookback?.toString() || '',
        af_sub1: registerDto.appsflyer?.af_sub1 || '',
        af_sub2: registerDto.appsflyer?.af_sub2 || '',
        af_sub3: registerDto.appsflyer?.af_sub3 || '',
        af_sub4: registerDto.appsflyer?.af_sub4 || '',
        af_sub5: registerDto.appsflyer?.af_sub5 || '',
      },
    };

    const url = `${this.casinoApiUrl}/api/mobile/v1/${this.casinoAppId}/register`;

    try {
      this.logger.debug(`Calling casino API: ${url}`, registerPayload);

      const response = await firstValueFrom(
        this.httpService.post<CasinoApiRegisterResponse>(url, registerPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.casinoBearerToken}`,
          },
          timeout: 10000, // 10 seconds timeout
        }),
      );

      const responseData = response.data;

      // Handle both response formats: direct visitor_id or nested in user object
      const visitorId =
        responseData?.visitor_id || responseData?.user?.visitor_id;

      if (!visitorId) {
        throw new BadRequestException(
          'Invalid response from casino API: missing visitor_id',
        );
      }

      this.logger.log(
        `Successfully registered user with casino API. Visitor ID: ${visitorId}`,
      );
      return visitorId;
    } catch (error) {
      this.logger.error('Failed to register user with casino API', {
        error: error.message,
        url,
        payload: registerPayload,
        response: error.response?.data,
      });

      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw new BadRequestException(
          `Casino API error: ${error.response?.data?.message || error.message}`,
        );
      }

      // For 5xx errors or network issues, throw a generic error
      throw new BadRequestException(
        'Unable to complete registration. Please try again later.',
      );
    }
  }

  isConfigured(): boolean {
    return !!(this.casinoApiUrl && this.casinoBearerToken && this.casinoAppId);
  }
}
