export declare class GameHistoryFilterDto {
    page?: number;
    limit?: number;
    game_name?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}
export declare class GameHistoryDto {
    id: number;
    bet: number;
    won: number;
    lost: number;
    net_result: number;
    game_name: string;
    game_mode?: string;
    session_duration?: number;
    created_at: Date;
}
export declare class GameHistoryResponseDto {
    sessions: GameHistoryDto[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
export declare class GameStatsDto {
    total_sessions: number;
    total_bet: number;
    total_won: number;
    total_lost: number;
    net_result: number;
    rtp_percentage: number;
    average_bet: number;
    average_won: number;
    games_played: number;
    game_breakdown: Record<string, number>;
    last_session: Date | null;
    first_session: Date | null;
}
