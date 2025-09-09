import { Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { PlayHistory } from '../../entities/play-history.entity';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';
interface DateRange {
    startDate?: Date;
    endDate?: Date;
}
export declare class AnalyticsService {
    private readonly playerRepository;
    private readonly playHistoryRepository;
    private readonly purchaseRepository;
    private readonly balanceChangeRepository;
    constructor(playerRepository: Repository<Player>, playHistoryRepository: Repository<PlayHistory>, purchaseRepository: Repository<InAppPurchase>, balanceChangeRepository: Repository<CoinsBalanceChange>);
    getOverviewStats(dateRange?: DateRange): Promise<{
        totalUsers: number;
        activeUsers: number;
        totalBalance: number;
        averageBalance: number;
        newRegistrations: number;
        totalRevenue: number;
        totalGamesPlayed: number;
    }>;
    getUserAnalytics(dateRange?: DateRange): Promise<{
        registrationTrends: {
            date: any;
            registrations: number;
        }[];
        retentionMetrics: {
            dayOne: number;
            daySeven: number;
            dayThirty: number;
        };
        userLevelDistribution: {
            level: any;
            userCount: number;
        }[];
        geographicDistribution: {
            region: any;
            userCount: number;
        }[];
    }>;
    getRevenueAnalytics(dateRange?: DateRange): Promise<{
        dailyRevenue: {
            date: any;
            revenue: number;
        }[];
        revenueByPlatform: {
            platform: any;
            revenue: number;
            transactions: number;
        }[];
        averageTransactionValue: number;
        topSpenders: {
            name: any;
            email: any;
            totalSpent: number;
            transactionCount: number;
        }[];
    }>;
    getGameAnalytics(dateRange?: DateRange): Promise<{
        gamePerformance: {
            gameName: any;
            totalPlays: number;
            totalBets: number;
            totalWins: number;
            totalLosses: number;
            avgBet: number;
            winRate: number;
        }[];
        dailyGameActivity: {
            date: any;
            totalPlays: number;
            uniquePlayers: number;
        }[];
        playerBehavior: {
            totalActivePlayers: number;
            avgPlaysPerPlayer: number;
            avgBetPerPlayer: number;
            totalGameRevenue: any;
        };
    }>;
    private getTotalUsers;
    private getActiveUsers;
    private getTotalBalance;
    private getNewRegistrations;
    private getTotalRevenue;
    private getTotalGamesPlayed;
    private getRegistrationTrends;
    private getRetentionMetrics;
    private getUserLevelDistribution;
    private getGeographicDistribution;
    private getDailyRevenue;
    private getRevenueByPlatform;
    private getAverageTransactionValue;
    private getTopSpenders;
    private getGamePerformance;
    private getDailyGameActivity;
    private getPlayerBehavior;
}
export {};
