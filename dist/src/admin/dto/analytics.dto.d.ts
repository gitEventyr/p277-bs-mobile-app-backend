export declare class DateRangeQueryDto {
    startDate?: string;
    endDate?: string;
}
export declare class OverviewStatsDto {
    totalUsers: number;
    activeUsers: number;
    totalBalance: number;
    averageBalance: number;
    newRegistrations: number;
    totalRevenue: number;
    totalGamesPlayed: number;
}
export declare class RegistrationTrendDto {
    date: string;
    registrations: number;
}
export declare class RetentionMetricsDto {
    dayOne: number;
    daySeven: number;
    dayThirty: number;
}
export declare class UserLevelDistributionDto {
    level: number;
    userCount: number;
    percentage: number;
}
export declare class GeographicDistributionDto {
    region: string;
    userCount: number;
}
export declare class UserAnalyticsDto {
    registrationTrends: RegistrationTrendDto[];
    retentionMetrics: RetentionMetricsDto;
    userLevelDistribution: UserLevelDistributionDto[];
    geographicDistribution: GeographicDistributionDto[];
}
export declare class DailyRevenueDto {
    date: string;
    revenue: number;
}
export declare class RevenueByPlatformDto {
    platform: string;
    revenue: number;
    transactions: number;
}
export declare class TopSpenderDto {
    name: string;
    email: string;
    totalSpent: number;
    transactionCount: number;
}
export declare class RevenueAnalyticsDto {
    dailyRevenue: DailyRevenueDto[];
    revenueByPlatform: RevenueByPlatformDto[];
    averageTransactionValue: number;
    topSpenders: TopSpenderDto[];
}
export declare class GamePerformanceDto {
    gameName: string;
    totalPlays: number;
    totalBets: number;
    totalWins: number;
    totalLosses: number;
    avgBet: number;
    winRate: number;
}
export declare class DailyGameActivityDto {
    date: string;
    totalPlays: number;
    uniquePlayers: number;
}
export declare class PlayerBehaviorDto {
    totalActivePlayers: number;
    avgPlaysPerPlayer: number;
    avgBetPerPlayer: number;
    totalGameRevenue: number;
}
export declare class GameAnalyticsDto {
    gamePerformance: GamePerformanceDto[];
    dailyGameActivity: DailyGameActivityDto[];
    playerBehavior: PlayerBehaviorDto;
}
