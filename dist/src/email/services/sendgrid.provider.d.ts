import { ConfigService } from '@nestjs/config';
import { EmailOptions, EmailProvider } from '../interfaces/email.interface';
export declare class SendGridProvider implements EmailProvider {
    private configService;
    private readonly logger;
    private defaultFromEmail;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<void>;
    sendTemplateEmail(templateId: string, to: string | string[], dynamicTemplateData: Record<string, any>, options?: Partial<EmailOptions>): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
