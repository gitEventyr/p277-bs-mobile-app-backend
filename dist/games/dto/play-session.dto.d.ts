export declare class PlaySessionDto {
    bet: number;
    won: number;
    lost: number;
    game_name: string;
    game_mode?: string;
    session_duration?: number;
}
export declare class PlaySessionResponseDto {
    id: number;
    bet: number;
    won: number;
    lost: number;
    net_result: number;
    game_name: string;
    game_mode?: string;
    session_duration?: number;
    created_at: Date;
    balance_change: {
        balance_before: number;
        balance_after: number;
        transaction_id: number;
    } | null;
}
