import { ConfigService } from '@nestjs/config';
import { EmailOptions, EmailProvider } from '../interfaces/email.interface';
export declare class AWSSESProvider implements EmailProvider {
    private configService;
    private readonly logger;
    private sesClient;
    private defaultFromEmail;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
