import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { OneSignalUserResponse } from './interfaces/onesignal.interface';
export declare class OneSignalService {
    private readonly configService;
    private readonly httpService;
    private readonly logger;
    private readonly apiBaseUrl;
    private readonly appId;
    private readonly apiKey;
    constructor(configService: ConfigService, httpService: HttpService);
    createEmailSubscription(visitorId: string, email: string): Promise<boolean>;
    sendTemplateEmail(templateId: string, visitorId: string, emailSubject: string, customData: Record<string, any>, email?: string): Promise<void>;
    createSMSSubscription(visitorId: string, phoneNumber: string): Promise<boolean>;
    sendTemplateSMS(templateId: string, visitorId: string, customData: Record<string, any>, phoneNumber?: string): Promise<void>;
    sendPasswordResetEmail(visitorId: string, resetLink: string, email?: string): Promise<void>;
    sendEmailVerificationCode(visitorId: string, verificationCode: string, email?: string): Promise<void>;
    sendPhoneVerificationCode(visitorId: string, verificationCode: string, phoneNumber?: string): Promise<void>;
    updateUserTags(visitorId: string, tags: Record<string, string>): Promise<boolean>;
    getUserSubscriptions(visitorId: string): Promise<OneSignalUserResponse | null>;
    disableSubscription(tokenType: 'Email' | 'SMS', token: string): Promise<boolean>;
    verifyConnection(): Promise<boolean>;
    isConfigured(): boolean;
    private sendNotification;
}
