import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
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
export interface ExternalCasino {
    id: number;
    admin_name: string;
}
export declare class CasinoApiService {
    private readonly configService;
    private readonly httpService;
    private readonly logger;
    private readonly casinoApiUrl;
    private readonly casinoBearerToken;
    private readonly casinoAppId;
    constructor(configService: ConfigService, httpService: HttpService);
    registerUser(registerDto: RegisterDto, ipAddress: string): Promise<string>;
    getCasinos(): Promise<ExternalCasino[]>;
    isConfigured(): boolean;
}
