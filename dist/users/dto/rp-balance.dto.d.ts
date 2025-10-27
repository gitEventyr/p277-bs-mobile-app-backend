export declare class ModifyRpBalanceDto {
    amount: number;
    reason?: string;
}
export declare class RpBalanceChangeResponseDto {
    balance_before: number;
    balance_after: number;
    amount: number;
    mode: string;
    transaction_id: number;
}
export declare class RpBalanceTransactionHistoryDto {
    id: number;
    balance_before: number;
    balance_after: number;
    amount: number;
    mode: string;
    reason?: string;
    admin_id?: string;
    created_at: Date;
}
export declare class RpBalanceTransactionHistoryResponseDto {
    data: RpBalanceTransactionHistoryDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
