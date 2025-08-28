import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service';
import { Player } from '../../entities/player.entity';
import { PlayHistory } from '../../entities/play-history.entity';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let playerRepo: Repository<Player>;
  let playHistoryRepo: Repository<PlayHistory>;
  let purchaseRepo: Repository<InAppPurchase>;
  let balanceChangeRepo: Repository<CoinsBalanceChange>;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  };

  const mockRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PlayHistory),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(InAppPurchase),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CoinsBalanceChange),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    playerRepo = module.get<Repository<Player>>(getRepositoryToken(Player));
    playHistoryRepo = module.get<Repository<PlayHistory>>(
      getRepositoryToken(PlayHistory),
    );
    purchaseRepo = module.get<Repository<InAppPurchase>>(
      getRepositoryToken(InAppPurchase),
    );
    balanceChangeRepo = module.get<Repository<CoinsBalanceChange>>(
      getRepositoryToken(CoinsBalanceChange),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOverviewStats', () => {
    it('should return overview statistics', async () => {
      // Mock repository responses
      mockRepository.count.mockResolvedValue(100);
      mockQueryBuilder.getCount.mockResolvedValueOnce(80); // active users
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ total: '5000.50' }); // total balance
      mockQueryBuilder.getCount.mockResolvedValueOnce(15); // new registrations
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ total: '2500.00' }); // total revenue
      mockQueryBuilder.getCount.mockResolvedValueOnce(500); // total games played

      const result = await service.getOverviewStats();

      expect(result).toEqual({
        totalUsers: 100,
        activeUsers: 80,
        totalBalance: 5000.5,
        averageBalance: 50.01,
        newRegistrations: 15,
        totalRevenue: 2500,
        totalGamesPlayed: 500,
      });
    });
  });

  describe('getUserAnalytics', () => {
    it('should return user analytics with registration trends', async () => {
      // Mock registration trends
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { date: '2025-08-27', count: '5' },
        { date: '2025-08-28', count: '8' },
      ]);

      // Mock retention metrics
      mockRepository.count.mockResolvedValueOnce(100); // total users
      mockQueryBuilder.getCount
        .mockResolvedValueOnce(90) // day 1 retained
        .mockResolvedValueOnce(70) // day 7 retained
        .mockResolvedValueOnce(50); // day 30 retained

      // Mock level distribution
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { level: 1, count: '50' },
        { level: 2, count: '30' },
        { level: 3, count: '20' },
      ]);

      // Mock geographic distribution
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { channel: 'Facebook', count: '40' },
        { channel: 'Google', count: '35' },
        { channel: 'Unknown', count: '25' },
      ]);

      const result = await service.getUserAnalytics();

      expect(result.registrationTrends).toEqual([
        { date: '2025-08-27', registrations: 5 },
        { date: '2025-08-28', registrations: 8 },
      ]);

      expect(result.retentionMetrics).toEqual({
        dayOne: 90,
        daySeven: 70,
        dayThirty: 50,
      });

      expect(result.userLevelDistribution).toEqual([
        { level: 1, userCount: 50 },
        { level: 2, userCount: 30 },
        { level: 3, userCount: 20 },
      ]);

      expect(result.geographicDistribution).toEqual([
        { region: 'Facebook', userCount: 40 },
        { region: 'Google', userCount: 35 },
        { region: 'Unknown', userCount: 25 },
      ]);
    });
  });

  describe('getRevenueAnalytics', () => {
    it('should return revenue analytics', async () => {
      // Mock daily revenue
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { date: '2025-08-27', revenue: '100.00' },
        { date: '2025-08-28', revenue: '150.50' },
      ]);

      // Mock revenue by platform
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { platform: 'ios', revenue: '1500.00', transactions: '50' },
        { platform: 'android', revenue: '1000.00', transactions: '40' },
      ]);

      // Mock average transaction value
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ average: '25.75' });

      // Mock top spenders
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        {
          name: 'John Doe',
          email: 'john@test.com',
          totalSpent: '500.00',
          transactionCount: '10',
        },
        {
          name: null,
          email: 'jane@test.com',
          totalSpent: '300.00',
          transactionCount: '8',
        },
      ]);

      const result = await service.getRevenueAnalytics();

      expect(result.dailyRevenue).toEqual([
        { date: '2025-08-27', revenue: 100 },
        { date: '2025-08-28', revenue: 150.5 },
      ]);

      expect(result.revenueByPlatform).toEqual([
        { platform: 'ios', revenue: 1500, transactions: 50 },
        { platform: 'android', revenue: 1000, transactions: 40 },
      ]);

      expect(result.averageTransactionValue).toBe(25.75);

      expect(result.topSpenders).toEqual([
        {
          name: 'John Doe',
          email: 'john@test.com',
          totalSpent: 500,
          transactionCount: 10,
        },
        {
          name: 'Anonymous',
          email: 'jane@test.com',
          totalSpent: 300,
          transactionCount: 8,
        },
      ]);
    });
  });

  describe('getGameAnalytics', () => {
    it('should return game analytics with performance metrics', async () => {
      // Mock game performance
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        {
          gameName: 'Slots',
          totalPlays: '100',
          totalBets: '1000.00',
          totalWins: '800.00',
          totalLosses: '200.00',
          avgBet: '10.00',
        },
      ]);

      // Mock daily game activity
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { date: '2025-08-27', totalPlays: '50', uniquePlayers: '25' },
        { date: '2025-08-28', totalPlays: '75', uniquePlayers: '30' },
      ]);

      // Mock player behavior
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([
        { userId: 1, totalPlays: '20', totalBets: '200.00', avgBet: '10.00' },
        { userId: 2, totalPlays: '15', totalBets: '150.00', avgBet: '10.00' },
      ]);

      const result = await service.getGameAnalytics();

      expect(result.gamePerformance).toEqual([
        {
          gameName: 'Slots',
          totalPlays: 100,
          totalBets: 1000,
          totalWins: 800,
          totalLosses: 200,
          avgBet: 10,
          winRate: 80, // 800/1000 * 100
        },
      ]);

      expect(result.dailyGameActivity).toEqual([
        { date: '2025-08-27', totalPlays: 50, uniquePlayers: 25 },
        { date: '2025-08-28', totalPlays: 75, uniquePlayers: 30 },
      ]);

      expect(result.playerBehavior).toEqual({
        totalActivePlayers: 2,
        avgPlaysPerPlayer: 18, // (20+15)/2 = 17.5 -> 18 rounded
        avgBetPerPlayer: 175, // (200+150)/2 = 175
        totalGameRevenue: 350, // 200+150 = 350
      });
    });
  });
});
