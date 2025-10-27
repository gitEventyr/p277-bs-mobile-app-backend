import { ConfigService } from '@nestjs/config';
import { EmailOptions, EmailTemplateType, EmailTemplateData } from '../interfaces/email.interface';
import { EmailTemplateService } from './email-template.service';
import { AWSSESProvider } from './aws-ses.provider';
import { SMTPProvider } from './smtp.provider';
import { SendGridProvider } from './sendgrid.provider';
export declare class EmailService {
    private configService;
    private templateService;
    private awsSESProvider;
    private smtpProvider;
    private sendGridProvider;
    private readonly logger;
    private emailProvider;
    constructor(configService: ConfigService, templateService: EmailTemplateService, awsSESProvider: AWSSESProvider, smtpProvider: SMTPProvider, sendGridProvider: SendGridProvider);
    private initializeProvider;
    sendEmail(options: EmailOptions): Promise<void>;
    sendTemplatedEmail(type: EmailTemplateType, to: string | string[], data: EmailTemplateData, options?: Partial<EmailOptions>): Promise<void>;
    sendDynamicTemplateEmail(templateId: string, to: string | string[], dynamicTemplateData: Record<string, any>, options?: Partial<EmailOptions>): Promise<void>;
    sendWelcomeEmail(to: string, userData: {
        name?: string;
        email: string;
        coinsBalance: number;
        ipAddress: string;
        loginUrl?: string;
    }): Promise<void>;
    sendEmailVerification(to: string, userData: {
        name?: string;
        verificationUrl?: string;
        resetCode?: string;
    }): Promise<void>;
    sendPasswordReset(to: string, userData: {
        name?: string;
        resetUrl?: string;
        resetLink?: string;
    }): Promise<void>;
    verifyConnection(): Promise<boolean>;
    healthCheck(): Promise<{
        status: string;
        provider: string;
        connected: boolean;
    }>;
}
