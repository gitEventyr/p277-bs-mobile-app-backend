import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class OneSignalService {
    private readonly configService;
    private readonly httpService;
    private readonly logger;
    private readonly apiBaseUrl;
    private readonly appId;
    private readonly apiKey;
    constructor(configService: ConfigService, httpService: HttpService);
    sendTemplateEmail(templateId: string, visitorId: string, emailSubject: string, customData: Record<string, any>): Promise<void>;
    sendTemplateSMS(templateId: string, visitorId: string, customData: Record<string, any>): Promise<void>;
    sendPasswordResetEmail(visitorId: string, resetLink: string, email?: string): Promise<void>;
    sendEmailVerificationCode(visitorId: string, verificationCode: string, email?: string): Promise<void>;
    sendPhoneVerificationCode(visitorId: string, verificationCode: string, phoneNumber?: string): Promise<void>;
    verifyConnection(): Promise<boolean>;
    isConfigured(): boolean;
    private sendNotification;
}
