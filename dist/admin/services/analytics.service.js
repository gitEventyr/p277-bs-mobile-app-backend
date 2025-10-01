"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../../entities/player.entity");
const play_history_entity_1 = require("../../entities/play-history.entity");
const in_app_purchase_entity_1 = require("../../entities/in-app-purchase.entity");
const coins_balance_change_entity_1 = require("../../entities/coins-balance-change.entity");
const rp_balance_transaction_entity_1 = require("../../entities/rp-balance-transaction.entity");
let AnalyticsService = class AnalyticsService {
    playerRepository;
    playHistoryRepository;
    purchaseRepository;
    balanceChangeRepository;
    rpBalanceRepository;
    constructor(playerRepository, playHistoryRepository, purchaseRepository, balanceChangeRepository, rpBalanceRepository) {
        this.playerRepository = playerRepository;
        this.playHistoryRepository = playHistoryRepository;
        this.purchaseRepository = purchaseRepository;
        this.balanceChangeRepository = balanceChangeRepository;
        this.rpBalanceRepository = rpBalanceRepository;
    }
    async getOverviewStats(dateRange) {
        const totalUsers = await this.getTotalUsers();
        const activeUsers = await this.getActiveUsers(dateRange);
        const totalBalance = await this.getTotalBalance();
        const totalRpBalance = await this.getTotalRpBalance();
        const newRegistrations = await this.getNewRegistrations(dateRange);
        const totalRevenue = await this.getTotalRevenue(dateRange);
        const totalGamesPlayed = await this.getTotalGamesPlayed(dateRange);
        const averageBalance = totalUsers > 0 ? totalBalance / totalUsers : 0;
        const averageRpBalance = totalUsers > 0 ? totalRpBalance / totalUsers : 0;
        return {
            totalUsers,
            activeUsers,
            totalBalance: Math.round(totalBalance * 100) / 100,
            totalRpBalance: Math.round(totalRpBalance * 100) / 100,
            averageBalance: Math.round(averageBalance * 100) / 100,
            averageRpBalance: Math.round(averageRpBalance * 100) / 100,
            newRegistrations,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalGamesPlayed,
        };
    }
    async getUserAnalytics(dateRange) {
        const registrationTrends = await this.getRegistrationTrends(dateRange);
        const retentionMetrics = await this.getRetentionMetrics();
        const userLevelDistribution = await this.getUserLevelDistribution();
        const geographicDistribution = await this.getGeographicDistribution();
        return {
            registrationTrends,
            retentionMetrics,
            userLevelDistribution,
            geographicDistribution,
        };
    }
    async getRevenueAnalytics(dateRange) {
        const dailyRevenue = await this.getDailyRevenue(dateRange);
        const revenueByPlatform = await this.getRevenueByPlatform(dateRange);
        const averageTransactionValue = await this.getAverageTransactionValue(dateRange);
        const topSpenders = await this.getTopSpenders(dateRange);
        return {
            dailyRevenue,
            revenueByPlatform,
            averageTransactionValue: Math.round(averageTransactionValue * 100) / 100,
            topSpenders,
        };
    }
    async getGameAnalytics(dateRange) {
        const gamePerformance = await this.getGamePerformance(dateRange);
        const dailyGameActivity = await this.getDailyGameActivity(dateRange);
        const playerBehavior = await this.getPlayerBehavior(dateRange);
        return {
            gamePerformance,
            dailyGameActivity,
            playerBehavior,
        };
    }
    async getTotalUsers() {
        return await this.playerRepository.count({
            where: { is_deleted: false },
        });
    }
    async getActiveUsers(dateRange) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = dateRange?.startDate || thirtyDaysAgo;
        const endDate = dateRange?.endDate || new Date();
        return await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.updated_at >= :startDate', { startDate })
            .andWhere('player.updated_at <= :endDate', { endDate })
            .getCount();
    }
    async getTotalBalance() {
        const result = await this.playerRepository
            .createQueryBuilder('player')
            .select('SUM(player.coins_balance)', 'total')
            .where('player.is_deleted = false')
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getTotalRpBalance() {
        const result = await this.playerRepository
            .createQueryBuilder('player')
            .select('SUM(player.rp_balance)', 'total')
            .where('player.is_deleted = false')
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getNewRegistrations(dateRange) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const startDate = dateRange?.startDate || twentyFourHoursAgo;
        const endDate = dateRange?.endDate || new Date();
        return await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.created_at >= :startDate', { startDate })
            .andWhere('player.created_at <= :endDate', { endDate })
            .getCount();
    }
    async getTotalRevenue(dateRange) {
        let query = this.purchaseRepository
            .createQueryBuilder('purchase')
            .select('SUM(purchase.amount)', 'total');
        if (dateRange?.startDate) {
            query = query.andWhere('purchase.purchased_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('purchase.purchased_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        const result = await query.getRawOne();
        return parseFloat(result?.total || '0');
    }
    async getTotalGamesPlayed(dateRange) {
        let query = this.playHistoryRepository.createQueryBuilder('play');
        if (dateRange?.startDate) {
            query = query.andWhere('play.created_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('play.created_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        return await query.getCount();
    }
    async getRegistrationTrends(dateRange) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = dateRange?.startDate || thirtyDaysAgo;
        const endDate = dateRange?.endDate || new Date();
        const result = await this.playerRepository
            .createQueryBuilder('player')
            .select('DATE(player.created_at)', 'date')
            .addSelect('COUNT(*)', 'count')
            .where('player.is_deleted = false')
            .andWhere('player.created_at >= :startDate', { startDate })
            .andWhere('player.created_at <= :endDate', { endDate })
            .groupBy('DATE(player.created_at)')
            .orderBy('DATE(player.created_at)', 'ASC')
            .getRawMany();
        return result.map((row) => ({
            date: row.date,
            registrations: parseInt(row.count),
        }));
    }
    async getRetentionMetrics() {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const totalNewUsers = await this.playerRepository.count({
            where: { is_deleted: false },
        });
        const dayOneRetained = await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.created_at <= :oneDayAgo', { oneDayAgo })
            .andWhere('player.updated_at >= :oneDayAgo', { oneDayAgo })
            .getCount();
        const daySevenRetained = await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.created_at <= :sevenDaysAgo', { sevenDaysAgo })
            .andWhere('player.updated_at >= :sevenDaysAgo', { sevenDaysAgo })
            .getCount();
        const dayThirtyRetained = await this.playerRepository
            .createQueryBuilder('player')
            .where('player.is_deleted = false')
            .andWhere('player.created_at <= :thirtyDaysAgo', { thirtyDaysAgo })
            .andWhere('player.updated_at >= :thirtyDaysAgo', { thirtyDaysAgo })
            .getCount();
        return {
            dayOne: totalNewUsers > 0
                ? Math.round((dayOneRetained / totalNewUsers) * 100)
                : 0,
            daySeven: totalNewUsers > 0
                ? Math.round((daySevenRetained / totalNewUsers) * 100)
                : 0,
            dayThirty: totalNewUsers > 0
                ? Math.round((dayThirtyRetained / totalNewUsers) * 100)
                : 0,
        };
    }
    async getUserLevelDistribution() {
        const result = await this.playerRepository
            .createQueryBuilder('player')
            .select('player.level', 'level')
            .addSelect('COUNT(*)', 'count')
            .where('player.is_deleted = false')
            .groupBy('player.level')
            .orderBy('player.level', 'ASC')
            .getRawMany();
        const totalUsers = result.reduce((sum, row) => sum + parseInt(row.count), 0);
        return result.map((row) => {
            const userCount = parseInt(row.count);
            const percentage = totalUsers > 0 ? Math.round((userCount / totalUsers) * 100) : 0;
            return {
                level: row.level,
                userCount,
                percentage,
            };
        });
    }
    async getGeographicDistribution() {
        const result = await this.playerRepository
            .createQueryBuilder('player')
            .select("COALESCE(player.af_channel, 'Unknown')", 'channel')
            .addSelect('COUNT(*)', 'count')
            .where('player.is_deleted = false')
            .groupBy('player.af_channel')
            .orderBy('COUNT(*)', 'DESC')
            .limit(10)
            .getRawMany();
        return result.map((row) => ({
            region: row.channel,
            userCount: parseInt(row.count),
        }));
    }
    async getDailyRevenue(dateRange) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = dateRange?.startDate || thirtyDaysAgo;
        const endDate = dateRange?.endDate || new Date();
        const result = await this.purchaseRepository
            .createQueryBuilder('purchase')
            .select('DATE(purchase.purchased_at)', 'date')
            .addSelect('SUM(purchase.amount)', 'revenue')
            .where('purchase.purchased_at >= :startDate', { startDate })
            .andWhere('purchase.purchased_at <= :endDate', { endDate })
            .groupBy('DATE(purchase.purchased_at)')
            .orderBy('DATE(purchase.purchased_at)', 'ASC')
            .getRawMany();
        return result.map((row) => ({
            date: row.date,
            revenue: parseFloat(row.revenue || '0'),
        }));
    }
    async getRevenueByPlatform(dateRange) {
        let query = this.purchaseRepository
            .createQueryBuilder('purchase')
            .select('purchase.platform', 'platform')
            .addSelect('SUM(purchase.amount)', 'revenue')
            .addSelect('COUNT(*)', 'transactions');
        if (dateRange?.startDate) {
            query = query.andWhere('purchase.purchased_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('purchase.purchased_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        const result = await query
            .groupBy('purchase.platform')
            .orderBy('SUM(purchase.amount)', 'DESC')
            .getRawMany();
        return result.map((row) => ({
            platform: row.platform,
            revenue: parseFloat(row.revenue || '0'),
            transactions: parseInt(row.transactions),
        }));
    }
    async getAverageTransactionValue(dateRange) {
        let query = this.purchaseRepository
            .createQueryBuilder('purchase')
            .select('AVG(purchase.amount)', 'average');
        if (dateRange?.startDate) {
            query = query.andWhere('purchase.purchased_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('purchase.purchased_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        const result = await query.getRawOne();
        return parseFloat(result?.average || '0');
    }
    async getTopSpenders(dateRange) {
        let query = this.purchaseRepository
            .createQueryBuilder('purchase')
            .leftJoinAndSelect('purchase.user', 'player')
            .select('player.name', 'name')
            .addSelect('player.email', 'email')
            .addSelect('SUM(purchase.amount)', 'totalSpent')
            .addSelect('COUNT(purchase.id)', 'transactionCount');
        if (dateRange?.startDate) {
            query = query.andWhere('purchase.purchased_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('purchase.purchased_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        const result = await query
            .groupBy('player.id, player.name, player.email')
            .orderBy('SUM(purchase.amount)', 'DESC')
            .limit(10)
            .getRawMany();
        return result.map((row) => ({
            name: row.name || 'Anonymous',
            email: row.email || 'N/A',
            totalSpent: parseFloat(row.totalSpent || '0'),
            transactionCount: parseInt(row.transactionCount),
        }));
    }
    async getGamePerformance(dateRange) {
        let query = this.playHistoryRepository
            .createQueryBuilder('play')
            .select('play.game_name', 'gameName')
            .addSelect('COUNT(*)', 'totalPlays')
            .addSelect('SUM(play.bet)', 'totalBets')
            .addSelect('SUM(play.won)', 'totalWins')
            .addSelect('SUM(play.lost)', 'totalLosses')
            .addSelect('AVG(play.bet)', 'avgBet');
        if (dateRange?.startDate) {
            query = query.andWhere('play.created_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('play.created_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        const result = await query
            .groupBy('play.game_name')
            .orderBy('COUNT(*)', 'DESC')
            .getRawMany();
        return result.map((row) => ({
            gameName: row.gameName,
            totalPlays: parseInt(row.totalPlays),
            totalBets: parseFloat(row.totalBets || '0'),
            totalWins: parseFloat(row.totalWins || '0'),
            totalLosses: parseFloat(row.totalLosses || '0'),
            avgBet: parseFloat(row.avgBet || '0'),
            winRate: row.totalPlays > 0
                ? Math.round((parseFloat(row.totalWins || '0') /
                    parseFloat(row.totalBets || '1')) *
                    100 *
                    100) / 100
                : 0,
        }));
    }
    async getDailyGameActivity(dateRange) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const startDate = dateRange?.startDate || sevenDaysAgo;
        const endDate = dateRange?.endDate || new Date();
        const result = await this.playHistoryRepository
            .createQueryBuilder('play')
            .select('DATE(play.created_at)', 'date')
            .addSelect('COUNT(*)', 'totalPlays')
            .addSelect('COUNT(DISTINCT play.user_id)', 'uniquePlayers')
            .where('play.created_at >= :startDate', { startDate })
            .andWhere('play.created_at <= :endDate', { endDate })
            .groupBy('DATE(play.created_at)')
            .orderBy('DATE(play.created_at)', 'ASC')
            .getRawMany();
        return result.map((row) => ({
            date: row.date,
            totalPlays: parseInt(row.totalPlays),
            uniquePlayers: parseInt(row.uniquePlayers),
        }));
    }
    async getPlayerBehavior(dateRange) {
        let query = this.playHistoryRepository
            .createQueryBuilder('play')
            .select('play.user_id', 'userId')
            .addSelect('COUNT(*)', 'totalPlays')
            .addSelect('SUM(play.bet)', 'totalBets')
            .addSelect('AVG(play.bet)', 'avgBet');
        if (dateRange?.startDate) {
            query = query.andWhere('play.created_at >= :startDate', {
                startDate: dateRange.startDate,
            });
        }
        if (dateRange?.endDate) {
            query = query.andWhere('play.created_at <= :endDate', {
                endDate: dateRange.endDate,
            });
        }
        const result = await query
            .groupBy('play.user_id')
            .orderBy('SUM(play.bet)', 'DESC')
            .limit(100)
            .getRawMany();
        const totalPlayers = result.length;
        const totalPlays = result.reduce((sum, row) => sum + parseInt(row.totalPlays), 0);
        const totalBets = result.reduce((sum, row) => sum + parseFloat(row.totalBets || '0'), 0);
        return {
            totalActivePlayers: totalPlayers,
            avgPlaysPerPlayer: totalPlayers > 0 ? Math.round(totalPlays / totalPlayers) : 0,
            avgBetPerPlayer: totalPlayers > 0
                ? Math.round((totalBets / totalPlayers) * 100) / 100
                : 0,
            totalGameRevenue: totalBets,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(play_history_entity_1.PlayHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(in_app_purchase_entity_1.InAppPurchase)),
    __param(3, (0, typeorm_1.InjectRepository)(coins_balance_change_entity_1.CoinsBalanceChange)),
    __param(4, (0, typeorm_1.InjectRepository)(rp_balance_transaction_entity_1.RpBalanceTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map