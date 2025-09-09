import { AnalyticsService } from '../services/analytics.service';
import { DateRangeQueryDto, OverviewStatsDto, UserAnalyticsDto, RevenueAnalyticsDto, GameAnalyticsDto } from '../dto/analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverviewStats(query: DateRangeQueryDto): Promise<OverviewStatsDto>;
    getUserAnalytics(query: DateRangeQueryDto): Promise<UserAnalyticsDto>;
    getRevenueAnalytics(query: DateRangeQueryDto): Promise<RevenueAnalyticsDto>;
    getGameAnalytics(query: DateRangeQueryDto): Promise<GameAnalyticsDto>;
    private parseDateRange;
}
