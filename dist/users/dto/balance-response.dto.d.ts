export declare class BalanceResponseDto {
    coins_balance: number;
    scratch_cards: number;
}
export declare class BalanceChangeResponseDto {
    balance_before: number;
    balance_after: number;
    amount: number;
    mode: string;
    transaction_id: number;
}
export declare class TransactionHistoryDto {
    id: number;
    balance_before: number;
    balance_after: number;
    amount: number;
    mode: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
export declare class TransactionHistoryResponseDto {
    data: TransactionHistoryDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
