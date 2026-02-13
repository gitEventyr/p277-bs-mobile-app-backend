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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAnalyticsDto = exports.PlayerBehaviorDto = exports.DailyGameActivityDto = exports.GamePerformanceDto = exports.RevenueAnalyticsDto = exports.TopSpenderDto = exports.RevenueByPlatformDto = exports.DailyRevenueDto = exports.UserAnalyticsDto = exports.GeographicDistributionDto = exports.UserLevelDistributionDto = exports.RetentionMetricsDto = exports.RegistrationTrendDto = exports.OverviewStatsDto = exports.DateRangeQueryDto = void 0;
const class_validator_1 = require("class-validator");
class DateRangeQueryDto {
    startDate;
    endDate;
}
exports.DateRangeQueryDto = DateRangeQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DateRangeQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DateRangeQueryDto.prototype, "endDate", void 0);
class OverviewStatsDto {
    totalUsers;
    activeUsers;
    totalBalance;
    averageBalance;
    newRegistrations;
    totalRevenue;
    totalGamesPlayed;
}
exports.OverviewStatsDto = OverviewStatsDto;
class RegistrationTrendDto {
    date;
    registrations;
}
exports.RegistrationTrendDto = RegistrationTrendDto;
class RetentionMetricsDto {
    dayOne;
    daySeven;
    dayThirty;
}
exports.RetentionMetricsDto = RetentionMetricsDto;
class UserLevelDistributionDto {
    level;
    userCount;
    percentage;
}
exports.UserLevelDistributionDto = UserLevelDistributionDto;
class GeographicDistributionDto {
    region;
    userCount;
}
exports.GeographicDistributionDto = GeographicDistributionDto;
class UserAnalyticsDto {
    registrationTrends;
    retentionMetrics;
    userLevelDistribution;
    geographicDistribution;
}
exports.UserAnalyticsDto = UserAnalyticsDto;
class DailyRevenueDto {
    date;
    revenue;
}
exports.DailyRevenueDto = DailyRevenueDto;
class RevenueByPlatformDto {
    platform;
    revenue;
    transactions;
}
exports.RevenueByPlatformDto = RevenueByPlatformDto;
class TopSpenderDto {
    name;
    email;
    totalSpent;
    transactionCount;
}
exports.TopSpenderDto = TopSpenderDto;
class RevenueAnalyticsDto {
    dailyRevenue;
    revenueByPlatform;
    averageTransactionValue;
    topSpenders;
}
exports.RevenueAnalyticsDto = RevenueAnalyticsDto;
class GamePerformanceDto {
    gameName;
    totalPlays;
    totalBets;
    totalWins;
    totalLosses;
    avgBet;
    winRate;
}
exports.GamePerformanceDto = GamePerformanceDto;
class DailyGameActivityDto {
    date;
    totalPlays;
    uniquePlayers;
}
exports.DailyGameActivityDto = DailyGameActivityDto;
class PlayerBehaviorDto {
    totalActivePlayers;
    avgPlaysPerPlayer;
    avgBetPerPlayer;
    totalGameRevenue;
}
exports.PlayerBehaviorDto = PlayerBehaviorDto;
class GameAnalyticsDto {
    gamePerformance;
    dailyGameActivity;
    playerBehavior;
}
exports.GameAnalyticsDto = GameAnalyticsDto;
//# sourceMappingURL=analytics.dto.js.map