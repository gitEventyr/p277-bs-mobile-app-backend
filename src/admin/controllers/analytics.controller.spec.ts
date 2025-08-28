import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from '../services/analytics.service';

// Mock the AdminGuard to avoid dependencies
jest.mock('../../auth/guards/admin.guard', () => {
  return {
    AdminGuard: jest.fn(() => {
      return {
        canActivate: jest.fn(() => true),
      };
    }),
  };
});

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: AnalyticsService;

  const mockAnalyticsService = {
    getOverviewStats: jest.fn(),
    getUserAnalytics: jest.fn(),
    getRevenueAnalytics: jest.fn(),
    getGameAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOverviewStats', () => {
    it('should return overview statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        activeUsers: 80,
        totalBalance: 5000.5,
        averageBalance: 50.01,
        newRegistrations: 15,
        totalRevenue: 2500,
        totalGamesPlayed: 500,
      };

      mockAnalyticsService.getOverviewStats.mockResolvedValue(mockStats);

      const result = await controller.getOverviewStats({});

      expect(result).toEqual(mockStats);
      expect(analyticsService.getOverviewStats).toHaveBeenCalledWith({});
    });

    it('should handle date range query parameters', async () => {
      const mockStats = {
        totalUsers: 50,
        activeUsers: 40,
        totalBalance: 2500,
        averageBalance: 50,
        newRegistrations: 5,
        totalRevenue: 1000,
        totalGamesPlayed: 250,
      };

      mockAnalyticsService.getOverviewStats.mockResolvedValue(mockStats);

      const query = {
        startDate: '2025-08-01T00:00:00.000Z',
        endDate: '2025-08-31T23:59:59.999Z',
      };

      const result = await controller.getOverviewStats(query);

      expect(result).toEqual(mockStats);
      expect(analyticsService.getOverviewStats).toHaveBeenCalledWith({
        startDate: new Date('2025-08-01T00:00:00.000Z'),
        endDate: new Date('2025-08-31T23:59:59.999Z'),
      });
    });

    it('should throw HttpException on service error', async () => {
      mockAnalyticsService.getOverviewStats.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getOverviewStats({})).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getOverviewStats({})).rejects.toThrow(
        'Failed to retrieve overview statistics',
      );
    });

    it('should handle invalid date format gracefully', async () => {
      const query = {
        startDate: 'invalid-date',
      };

      await expect(controller.getOverviewStats(query)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getOverviewStats(query)).rejects.toThrow(
        'Invalid startDate format',
      );
    });

    it('should handle invalid date range gracefully', async () => {
      const query = {
        startDate: '2025-08-31T00:00:00.000Z',
        endDate: '2025-08-01T00:00:00.000Z',
      };

      await expect(controller.getOverviewStats(query)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getOverviewStats(query)).rejects.toThrow(
        'startDate cannot be after endDate',
      );
    });
  });

  describe('getUserAnalytics', () => {
    it('should return user analytics', async () => {
      const mockUserAnalytics = {
        registrationTrends: [
          { date: '2025-08-27', registrations: 5 },
          { date: '2025-08-28', registrations: 8 },
        ],
        retentionMetrics: {
          dayOne: 90,
          daySeven: 70,
          dayThirty: 50,
        },
        userLevelDistribution: [
          { level: 1, userCount: 50 },
          { level: 2, userCount: 30 },
        ],
        geographicDistribution: [
          { region: 'Facebook', userCount: 40 },
          { region: 'Google', userCount: 35 },
        ],
      };

      mockAnalyticsService.getUserAnalytics.mockResolvedValue(
        mockUserAnalytics,
      );

      const result = await controller.getUserAnalytics({});

      expect(result).toEqual(mockUserAnalytics);
      expect(analyticsService.getUserAnalytics).toHaveBeenCalledWith({});
    });

    it('should throw HttpException on service error', async () => {
      mockAnalyticsService.getUserAnalytics.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getUserAnalytics({})).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getUserAnalytics({})).rejects.toThrow(
        'Failed to retrieve user analytics',
      );
    });
  });

  describe('getRevenueAnalytics', () => {
    it('should return revenue analytics', async () => {
      const mockRevenueAnalytics = {
        dailyRevenue: [
          { date: '2025-08-27', revenue: 100 },
          { date: '2025-08-28', revenue: 150.5 },
        ],
        revenueByPlatform: [
          { platform: 'ios', revenue: 1500, transactions: 50 },
          { platform: 'android', revenue: 1000, transactions: 40 },
        ],
        averageTransactionValue: 25.75,
        topSpenders: [
          {
            name: 'John Doe',
            email: 'john@test.com',
            totalSpent: 500,
            transactionCount: 10,
          },
        ],
      };

      mockAnalyticsService.getRevenueAnalytics.mockResolvedValue(
        mockRevenueAnalytics,
      );

      const result = await controller.getRevenueAnalytics({});

      expect(result).toEqual(mockRevenueAnalytics);
      expect(analyticsService.getRevenueAnalytics).toHaveBeenCalledWith({});
    });

    it('should throw HttpException on service error', async () => {
      mockAnalyticsService.getRevenueAnalytics.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getRevenueAnalytics({})).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getRevenueAnalytics({})).rejects.toThrow(
        'Failed to retrieve revenue analytics',
      );
    });
  });

  describe('getGameAnalytics', () => {
    it('should return game analytics', async () => {
      const mockGameAnalytics = {
        gamePerformance: [
          {
            gameName: 'Slots',
            totalPlays: 100,
            totalBets: 1000,
            totalWins: 800,
            totalLosses: 200,
            avgBet: 10,
            winRate: 80,
          },
        ],
        dailyGameActivity: [
          { date: '2025-08-27', totalPlays: 50, uniquePlayers: 25 },
          { date: '2025-08-28', totalPlays: 75, uniquePlayers: 30 },
        ],
        playerBehavior: {
          totalActivePlayers: 2,
          avgPlaysPerPlayer: 18,
          avgBetPerPlayer: 175,
          totalGameRevenue: 350,
        },
      };

      mockAnalyticsService.getGameAnalytics.mockResolvedValue(
        mockGameAnalytics,
      );

      const result = await controller.getGameAnalytics({});

      expect(result).toEqual(mockGameAnalytics);
      expect(analyticsService.getGameAnalytics).toHaveBeenCalledWith({});
    });

    it('should throw HttpException on service error', async () => {
      mockAnalyticsService.getGameAnalytics.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getGameAnalytics({})).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getGameAnalytics({})).rejects.toThrow(
        'Failed to retrieve game analytics',
      );
    });
  });
});
