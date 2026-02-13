import { PurchasesService } from '../services/purchases.service';
import { RecordPurchaseDto, PurchaseHistoryQueryDto } from '../dto/purchase.dto';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    recordPurchase(user: any, purchaseDto: RecordPurchaseDto): Promise<{
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
    getPurchaseHistory(user: any, queryDto: PurchaseHistoryQueryDto): Promise<{
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
    getPurchaseStats(user: any): Promise<{
        total_spent: number;
        total_purchases: number;
        recent_purchases: {
            id: number;
            product_id: string;
            amount: number;
            purchased_at: Date;
        }[];
    }>;
    getPurchaseById(user: any, purchaseId: number): Promise<{
        id: number;
        platform: string;
        product_id: string;
        transaction_id: string;
        amount: number;
        currency: string;
        purchased_at: Date;
        created_at: Date;
    }>;
}
