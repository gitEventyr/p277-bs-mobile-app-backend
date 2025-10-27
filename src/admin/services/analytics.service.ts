import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { PlayHistory } from '../../entities/play-history.entity';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';
import { RpBalanceTransaction } from '../../entities/rp-balance-transaction.entity';
import { CasinoAction } from '../../entities/casino-action.entity';

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(PlayHistory)
    private readonly playHistoryRepository: Repository<PlayHistory>,
    @InjectRepository(InAppPurchase)
    private readonly purchaseRepository: Repository<InAppPurchase>,
    @InjectRepository(CoinsBalanceChange)
    private readonly balanceChangeRepository: Repository<CoinsBalanceChange>,
    @InjectRepository(RpBalanceTransaction)
    private readonly rpBalanceRepository: Repository<RpBalanceTransaction>,
    @InjectRepository(CasinoAction)
    private readonly casinoActionRepository: Repository<CasinoAction>,
  ) {}

  async getOverviewStats(dateRange?: DateRange) {
    const totalUsers = await this.getTotalUsers();
    const activeUsers = await this.getActiveUsers(dateRange);
    const totalBalance = await this.getTotalBalance();
    const totalRpBalance = await this.getTotalRpBalance();
    const newRegistrations = await this.getNewRegistrations(dateRange);
    const totalRevenue = await this.getTotalRevenue(dateRange);
    const totalGamesPlayed = await this.getTotalGamesPlayed(dateRange);
    const averageBalance = totalUsers > 0 ? totalBalance / totalUsers : 0;
    const averageRpBalance = totalUsers > 0 ? totalRpBalance / totalUsers : 0;

    // Casino action statistics
    const allDeposits = await this.getAllDeposits(dateRange);
    const allRegistrations = await this.getAllRegistrations(dateRange);
    const uniqueDeposits = await this.getUniqueDeposits(dateRange);
    const uniqueRegistrations = await this.getUniqueRegistrations(dateRange);

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
      allDeposits,
      allRegistrations,
      uniqueDeposits,
      uniqueRegistrations,
    };
  }

  async getUserAnalytics(dateRange?: DateRange) {
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

  async getRevenueAnalytics(dateRange?: DateRange) {
    const dailyRevenue = await this.getDailyRevenue(dateRange);
    const revenueByPlatform = await this.getRevenueByPlatform(dateRange);
    const averageTransactionValue =
      await this.getAverageTransactionValue(dateRange);
    const topSpenders = await this.getTopSpenders(dateRange);
    const lastTransactions = await this.getLastTransactions();

    return {
      dailyRevenue,
      revenueByPlatform,
      averageTransactionValue: Math.round(averageTransactionValue * 100) / 100,
      topSpenders,
      lastTransactions,
    };
  }

  async getGameAnalytics(dateRange?: DateRange) {
    const gamePerformance = await this.getGamePerformance(dateRange);
    const dailyGameActivity = await this.getDailyGameActivity(dateRange);
    const playerBehavior = await this.getPlayerBehavior(dateRange);

    return {
      gamePerformance,
      dailyGameActivity,
      playerBehavior,
    };
  }

  // Private helper methods
  private async getTotalUsers(): Promise<number> {
    return await this.playerRepository.count({
      where: { is_deleted: false },
    });
  }

  private async getActiveUsers(dateRange?: DateRange): Promise<number> {
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

  private async getTotalBalance(): Promise<number> {
    const result = await this.playerRepository
      .createQueryBuilder('player')
      .select('SUM(player.coins_balance)', 'total')
      .where('player.is_deleted = false')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  private async getTotalRpBalance(): Promise<number> {
    const result = await this.playerRepository
      .createQueryBuilder('player')
      .select('SUM(player.rp_balance)', 'total')
      .where('player.is_deleted = false')
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  private async getNewRegistrations(dateRange?: DateRange): Promise<number> {
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

  private async getTotalRevenue(dateRange?: DateRange): Promise<number> {
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

  private async getTotalGamesPlayed(dateRange?: DateRange): Promise<number> {
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

  private async getRegistrationTrends(dateRange?: DateRange) {
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

  private async getRetentionMetrics() {
    // Calculate 1-day, 7-day, and 30-day retention
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
      dayOne:
        totalNewUsers > 0
          ? Math.round((dayOneRetained / totalNewUsers) * 100)
          : 0,
      daySeven:
        totalNewUsers > 0
          ? Math.round((daySevenRetained / totalNewUsers) * 100)
          : 0,
      dayThirty:
        totalNewUsers > 0
          ? Math.round((dayThirtyRetained / totalNewUsers) * 100)
          : 0,
    };
  }

  private async getUserLevelDistribution() {
    const result = await this.playerRepository
      .createQueryBuilder('player')
      .select('player.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('player.is_deleted = false')
      .groupBy('player.level')
      .orderBy('player.level', 'ASC')
      .getRawMany();

    const totalUsers = result.reduce(
      (sum, row) => sum + parseInt(row.count),
      0,
    );

    return result.map((row) => {
      const userCount = parseInt(row.count);
      const percentage =
        totalUsers > 0 ? Math.round((userCount / totalUsers) * 100) : 0;
      return {
        level: row.level,
        userCount,
        percentage,
      };
    });
  }

  private async getGeographicDistribution() {
    // Since we don't have direct geographic data, we'll use AppsFlyer channels as proxy
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

  private async getDailyRevenue(dateRange?: DateRange) {
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

  private async getRevenueByPlatform(dateRange?: DateRange) {
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

  private async getAverageTransactionValue(
    dateRange?: DateRange,
  ): Promise<number> {
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

  private async getTopSpenders(dateRange?: DateRange) {
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

  private async getLastTransactions() {
    const transactions = await this.purchaseRepository.find({
      relations: ['user'],
      order: { purchased_at: 'DESC' },
      take: 10,
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      userName: transaction.user?.name || 'Anonymous',
      userEmail: transaction.user?.email || 'N/A',
      amount: parseFloat(transaction.amount.toString()),
      currency: transaction.currency,
      platform: transaction.platform,
      productId: transaction.product_id,
      transactionId: transaction.transaction_id,
      purchasedAt: transaction.purchased_at,
    }));
  }

  private async getGamePerformance(dateRange?: DateRange) {
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
      winRate:
        row.totalPlays > 0
          ? Math.round(
              (parseFloat(row.totalWins || '0') /
                parseFloat(row.totalBets || '1')) *
                100 *
                100,
            ) / 100
          : 0,
    }));
  }

  private async getDailyGameActivity(dateRange?: DateRange) {
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

  private async getPlayerBehavior(dateRange?: DateRange) {
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
    const totalPlays = result.reduce(
      (sum, row) => sum + parseInt(row.totalPlays),
      0,
    );
    const totalBets = result.reduce(
      (sum, row) => sum + parseFloat(row.totalBets || '0'),
      0,
    );

    return {
      totalActivePlayers: totalPlayers,
      avgPlaysPerPlayer:
        totalPlayers > 0 ? Math.round(totalPlays / totalPlayers) : 0,
      avgBetPerPlayer:
        totalPlayers > 0
          ? Math.round((totalBets / totalPlayers) * 100) / 100
          : 0,
      totalGameRevenue: totalBets,
    };
  }

  // Casino action statistics methods
  private async getAllDeposits(dateRange?: DateRange): Promise<number> {
    let query = this.casinoActionRepository
      .createQueryBuilder('action')
      .where('action.deposit = :deposit', { deposit: true });

    if (dateRange?.startDate) {
      query = query.andWhere('action.date_of_action >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange?.endDate) {
      query = query.andWhere('action.date_of_action <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    return await query.getCount();
  }

  private async getAllRegistrations(dateRange?: DateRange): Promise<number> {
    let query = this.casinoActionRepository
      .createQueryBuilder('action')
      .where('action.registration = :registration', { registration: true });

    if (dateRange?.startDate) {
      query = query.andWhere('action.date_of_action >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange?.endDate) {
      query = query.andWhere('action.date_of_action <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    return await query.getCount();
  }

  private async getUniqueDeposits(dateRange?: DateRange): Promise<number> {
    let query = this.casinoActionRepository
      .createQueryBuilder('action')
      .select(
        'COUNT(DISTINCT CONCAT(action.visitor_id, action.casino_name))',
        'count',
      )
      .where('action.deposit = :deposit', { deposit: true });

    if (dateRange?.startDate) {
      query = query.andWhere('action.date_of_action >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange?.endDate) {
      query = query.andWhere('action.date_of_action <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    const result = await query.getRawOne();
    return parseInt(result?.count || '0');
  }

  private async getUniqueRegistrations(dateRange?: DateRange): Promise<number> {
    let query = this.casinoActionRepository
      .createQueryBuilder('action')
      .select(
        'COUNT(DISTINCT CONCAT(action.visitor_id, action.casino_name))',
        'count',
      )
      .where('action.registration = :registration', { registration: true });

    if (dateRange?.startDate) {
      query = query.andWhere('action.date_of_action >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange?.endDate) {
      query = query.andWhere('action.date_of_action <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    const result = await query.getRawOne();
    return parseInt(result?.count || '0');
  }
}
