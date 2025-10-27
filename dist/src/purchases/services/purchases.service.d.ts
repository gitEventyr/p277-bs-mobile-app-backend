import { Repository, DataSource } from 'typeorm';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';
import { Player } from '../../entities/player.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';
import { PaymentValidationService } from '../../external/payments/payment-validation.service';
import { RpRewardEventService } from '../../users/services/rp-reward-event.service';
import { RecordPurchaseDto, PurchaseHistoryQueryDto } from '../dto/purchase.dto';
export declare class PurchasesService {
    private readonly purchaseRepository;
    private readonly playerRepository;
    private readonly balanceChangeRepository;
    private readonly paymentValidationService;
    private readonly dataSource;
    private readonly rpRewardEventService;
    private readonly logger;
    constructor(purchaseRepository: Repository<InAppPurchase>, playerRepository: Repository<Player>, balanceChangeRepository: Repository<CoinsBalanceChange>, paymentValidationService: PaymentValidationService, dataSource: DataSource, rpRewardEventService: RpRewardEventService);
    recordPurchase(userId: number, purchaseDto: RecordPurchaseDto): Promise<{
        purchase: {
            id: number;
            platform: string;
            product_id: string;
            transaction_id: string;
            amount: number;
            currency: string;
            purchased_at: Date;
            created_at: Date;
        };
        balance_update: {
            balance_before: number;
            balance_after: number;
            amount: number;
            mode: string;
            transaction_id: number;
        };
    }>;
    getPurchaseHistory(userId: number, queryDto: PurchaseHistoryQueryDto): Promise<{
        data: {
            id: number;
            platform: string;
            product_id: string;
            transaction_id: string;
            amount: number;
            currency: string;
            purchased_at: Date;
            created_at: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getPurchaseById(userId: number, purchaseId: number): Promise<{
        id: number;
        platform: string;
        product_id: string;
        transaction_id: string;
        amount: number;
        currency: string;
        purchased_at: Date;
        created_at: Date;
    }>;
    getTotalSpent(userId: number): Promise<number>;
    getPurchaseStats(userId: number): Promise<{
        total_spent: number;
        total_purchases: number;
        recent_purchases: {
            id: number;
            product_id: string;
            amount: number;
            purchased_at: Date;
        }[];
    }>;
}
