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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../../auth/guards/admin.guard");
const analytics_service_1 = require("../services/analytics.service");
const analytics_dto_1 = require("../dto/analytics.dto");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getOverviewStats(query) {
        try {
            const dateRange = this.parseDateRange(query);
            return await this.analyticsService.getOverviewStats(dateRange);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Overview stats error:', error);
            throw new common_1.HttpException('Failed to retrieve overview statistics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserAnalytics(query) {
        try {
            const dateRange = this.parseDateRange(query);
            return await this.analyticsService.getUserAnalytics(dateRange);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('User analytics error:', error);
            throw new common_1.HttpException('Failed to retrieve user analytics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRevenueAnalytics(query) {
        try {
            const dateRange = this.parseDateRange(query);
            return await this.analyticsService.getRevenueAnalytics(dateRange);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Revenue analytics error:', error);
            throw new common_1.HttpException('Failed to retrieve revenue analytics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGameAnalytics(query) {
        try {
            const dateRange = this.parseDateRange(query);
            return await this.analyticsService.getGameAnalytics(dateRange);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Game analytics error:', error);
            throw new common_1.HttpException('Failed to retrieve game analytics', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    parseDateRange(query) {
        const dateRange = {};
        if (query.startDate) {
            dateRange.startDate = new Date(query.startDate);
            if (isNaN(dateRange.startDate.getTime())) {
                throw new common_1.HttpException('Invalid startDate format', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (query.endDate) {
            dateRange.endDate = new Date(query.endDate);
            if (isNaN(dateRange.endDate.getTime())) {
                throw new common_1.HttpException('Invalid endDate format', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (dateRange.startDate &&
            dateRange.endDate &&
            dateRange.startDate > dateRange.endDate) {
            throw new common_1.HttpException('startDate cannot be after endDate', common_1.HttpStatus.BAD_REQUEST);
        }
        return dateRange;
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overview dashboard statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overview statistics retrieved successfully',
        type: analytics_dto_1.OverviewStatsDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverviewStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user registration and activity analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User analytics retrieved successfully',
        type: analytics_dto_1.UserAnalyticsDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue and purchase analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Revenue analytics retrieved successfully',
        type: analytics_dto_1.RevenueAnalyticsDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenueAnalytics", null);
__decorate([
    (0, common_1.Get)('games'),
    (0, swagger_1.ApiOperation)({ summary: 'Get game performance analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Game analytics retrieved successfully',
        type: analytics_dto_1.GameAnalyticsDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGameAnalytics", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('🖥️ Dashboard: Analytics'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Controller)('admin/analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map