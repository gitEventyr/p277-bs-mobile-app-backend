import { IsOptional, IsDateString, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DateRangeQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class OverviewStatsDto {
  totalUsers: number;
  activeUsers: number;
  totalBalance: number;
  averageBalance: number;
  newRegistrations: number;
  totalRevenue: number;
  totalGamesPlayed: number;
}

export class RegistrationTrendDto {
  date: string;
  registrations: number;
}

export class RetentionMetricsDto {
  dayOne: number;
  daySeven: number;
  dayThirty: number;
}

export class UserLevelDistributionDto {
  level: number;
  userCount: number;
}

export class GeographicDistributionDto {
  region: string;
  userCount: number;
}

export class UserAnalyticsDto {
  registrationTrends: RegistrationTrendDto[];
  retentionMetrics: RetentionMetricsDto;
  userLevelDistribution: UserLevelDistributionDto[];
  geographicDistribution: GeographicDistributionDto[];
}

export class DailyRevenueDto {
  date: string;
  revenue: number;
}

export class RevenueByPlatformDto {
  platform: string;
  revenue: number;
  transactions: number;
}

export class TopSpenderDto {
  name: string;
  email: string;
  totalSpent: number;
  transactionCount: number;
}

export class RevenueAnalyticsDto {
  dailyRevenue: DailyRevenueDto[];
  revenueByPlatform: RevenueByPlatformDto[];
  averageTransactionValue: number;
  topSpenders: TopSpenderDto[];
}

export class GamePerformanceDto {
  gameName: string;
  totalPlays: number;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  avgBet: number;
  winRate: number;
}

export class DailyGameActivityDto {
  date: string;
  totalPlays: number;
  uniquePlayers: number;
}

export class PlayerBehaviorDto {
  totalActivePlayers: number;
  avgPlaysPerPlayer: number;
  avgBetPerPlayer: number;
  totalGameRevenue: number;
}

export class GameAnalyticsDto {
  gamePerformance: GamePerformanceDto[];
  dailyGameActivity: DailyGameActivityDto[];
  playerBehavior: PlayerBehaviorDto;
}
