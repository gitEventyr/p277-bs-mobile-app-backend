import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class OneSignalService {
    private readonly configService;
    private readonly httpService;
    private readonly logger;
    private readonly apiUrl;
    private readonly appId;
    private readonly apiKey;
    constructor(configService: ConfigService, httpService: HttpService);
    sendTemplateEmail(templateId: string, email: string, customData: Record<string, any>): Promise<void>;
    sendTemplateSMS(templateId: string, phoneNumber: string, customData: Record<string, any>): Promise<void>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
    sendEmailVerificationCode(email: string, verificationCode: string): Promise<void>;
    sendPhoneVerificationCode(phoneNumber: string, verificationCode: string): Promise<void>;
    verifyConnection(): Promise<boolean>;
    isConfigured(): boolean;
    private sendNotification;
}
