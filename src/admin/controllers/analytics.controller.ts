import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AnalyticsService } from '../services/analytics.service';
import {
  DateRangeQueryDto,
  OverviewStatsDto,
  UserAnalyticsDto,
  RevenueAnalyticsDto,
  GameAnalyticsDto,
} from '../dto/analytics.dto';

@ApiTags('🖥️ Dashboard: Analytics')
@ApiBearerAuth('access-token')
@UseGuards(AdminGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get overview dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Overview statistics retrieved successfully',
    type: OverviewStatsDto,
  })
  async getOverviewStats(
    @Query() query: DateRangeQueryDto,
  ): Promise<OverviewStatsDto> {
    try {
      const dateRange = this.parseDateRange(query);
      return await this.analyticsService.getOverviewStats(dateRange);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw validation errors
      }
      console.error('Overview stats error:', error);
      throw new HttpException(
        'Failed to retrieve overview statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user registration and activity analytics' })
  @ApiResponse({
    status: 200,
    description: 'User analytics retrieved successfully',
    type: UserAnalyticsDto,
  })
  async getUserAnalytics(
    @Query() query: DateRangeQueryDto,
  ): Promise<UserAnalyticsDto> {
    try {
      const dateRange = this.parseDateRange(query);
      return await this.analyticsService.getUserAnalytics(dateRange);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw validation errors
      }
      console.error('User analytics error:', error);
      throw new HttpException(
        'Failed to retrieve user analytics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue and purchase analytics' })
  @ApiResponse({
    status: 200,
    description: 'Revenue analytics retrieved successfully',
    type: RevenueAnalyticsDto,
  })
  async getRevenueAnalytics(
    @Query() query: DateRangeQueryDto,
  ): Promise<RevenueAnalyticsDto> {
    try {
      const dateRange = this.parseDateRange(query);
      return await this.analyticsService.getRevenueAnalytics(dateRange);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw validation errors
      }
      console.error('Revenue analytics error:', error);
      throw new HttpException(
        'Failed to retrieve revenue analytics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('games')
  @ApiOperation({ summary: 'Get game performance analytics' })
  @ApiResponse({
    status: 200,
    description: 'Game analytics retrieved successfully',
    type: GameAnalyticsDto,
  })
  async getGameAnalytics(
    @Query() query: DateRangeQueryDto,
  ): Promise<GameAnalyticsDto> {
    try {
      const dateRange = this.parseDateRange(query);
      return await this.analyticsService.getGameAnalytics(dateRange);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw validation errors
      }
      console.error('Game analytics error:', error);
      throw new HttpException(
        'Failed to retrieve game analytics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private parseDateRange(query: DateRangeQueryDto) {
    const dateRange: { startDate?: Date; endDate?: Date } = {};

    if (query.startDate) {
      dateRange.startDate = new Date(query.startDate);
      if (isNaN(dateRange.startDate.getTime())) {
        throw new HttpException(
          'Invalid startDate format',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (query.endDate) {
      dateRange.endDate = new Date(query.endDate);
      if (isNaN(dateRange.endDate.getTime())) {
        throw new HttpException(
          'Invalid endDate format',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Validate date range
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.startDate > dateRange.endDate
    ) {
      throw new HttpException(
        'startDate cannot be after endDate',
        HttpStatus.BAD_REQUEST,
      );
    }

    return dateRange;
  }
}
