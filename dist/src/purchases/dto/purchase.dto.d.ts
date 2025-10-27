export declare class RecordPurchaseDto {
    platform: string;
    product_id: string;
    transaction_id: string;
    amount: number;
    currency?: string;
    purchased_at: string;
    coins_amount: number;
    receipt_data?: string;
}
export declare class PurchaseHistoryQueryDto {
    page?: number;
    limit?: number;
    platform?: string;
}
export declare class PurchaseResponseDto {
    id: number;
    platform: string;
    product_id: string;
    transaction_id: string;
    amount: number;
    currency: string;
    purchased_at: Date;
    created_at: Date;
}
