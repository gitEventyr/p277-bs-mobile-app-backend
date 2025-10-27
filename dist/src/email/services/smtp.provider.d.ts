import { ConfigService } from '@nestjs/config';
import { EmailOptions, EmailProvider } from '../interfaces/email.interface';
export declare class SMTPProvider implements EmailProvider {
    private configService;
    private readonly logger;
    private transporter;
    private defaultFromEmail;
    constructor(configService: ConfigService);
    private createTransporter;
    private createTestTransporter;
    sendEmail(options: EmailOptions): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
