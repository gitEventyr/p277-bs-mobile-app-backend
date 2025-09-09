import { ConfigService } from '@nestjs/config';
export declare class TwilioService {
    private readonly configService;
    private readonly logger;
    private client;
    private verifyServiceSid;
    constructor(configService: ConfigService);
    sendVerificationCode(phoneNumber: string): Promise<void>;
    verifyCode(phoneNumber: string, code: string): Promise<boolean>;
}
