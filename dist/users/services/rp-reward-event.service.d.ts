import { Repository } from 'typeorm';
import { RpBalanceService } from './rp-balance.service';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';
export declare enum RpRewardEvent {
    EMAIL_VERIFICATION = "email_verification",
    PHONE_VERIFICATION = "phone_verification",
    REGISTRATION = "registration",
    FIRST_PURCHASE = "first_purchase",
    PURCHASE = "purchase"
}
export declare class RpRewardEventService {
    private readonly rpBalanceService;
    private readonly purchaseRepository;
    private readonly logger;
    private readonly rewardAmounts;
    constructor(rpBalanceService: RpBalanceService, purchaseRepository: Repository<InAppPurchase>);
    awardRpForEvent(userId: number, event: RpRewardEvent, reason?: string): Promise<void>;
    awardEmailVerificationReward(userId: number): Promise<void>;
    awardPhoneVerificationReward(userId: number): Promise<void>;
    awardRegistrationReward(userId: number): Promise<void>;
    awardPurchaseReward(userId: number, productId?: string): Promise<void>;
    private isUserFirstPurchase;
    private getDefaultReason;
}
