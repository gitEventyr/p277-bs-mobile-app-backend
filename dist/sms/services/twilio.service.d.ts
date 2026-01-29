import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PhoneVerificationToken } from '../../entities/phone-verification-token.entity';
import { OneSignalService } from '../../external/onesignal/onesignal.service';
export declare class TwilioService {
    private readonly configService;
    private readonly phoneVerificationTokenRepository;
    private readonly oneSignalService;
    private readonly logger;
    private client;
    private verifyServiceSid;
    constructor(configService: ConfigService, phoneVerificationTokenRepository: Repository<PhoneVerificationToken>, oneSignalService: OneSignalService);
    sendVerificationCode(phoneNumber: string, userId?: number): Promise<void>;
    verifyCode(phoneNumber: string, code: string, userId?: number): Promise<boolean>;
}
