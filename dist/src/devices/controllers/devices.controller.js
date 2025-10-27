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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const devices_service_1 = require("../services/devices.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const mobile_exception_filter_1 = require("../../common/filters/mobile-exception.filter");
const device_response_dto_1 = require("../dto/device-response.dto");
let DevicesController = class DevicesController {
    devicesService;
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    async getUserDevices(user) {
        return await this.devicesService.getUserDevices(user.id);
    }
    async getDeviceById(user, deviceId) {
        return await this.devicesService.getDeviceById(user.id, deviceId);
    }
    async getDeviceStats(user) {
        return await this.devicesService.getDeviceStats(user.id);
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all user devices' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User devices retrieved successfully',
        type: device_response_dto_1.DeviceListResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getUserDevices", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get specific device information' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Device ID',
        type: 'integer',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Device information retrieved successfully',
        type: device_response_dto_1.DeviceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Device not found',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDeviceById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get device usage statistics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Device statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalDevices: { type: 'number', example: 3 },
                operatingSystems: {
                    type: 'object',
                    example: { iOS: 2, Android: 1 },
                },
                browsers: {
                    type: 'object',
                    example: { Safari: 2, Chrome: 1 },
                },
                countries: {
                    type: 'object',
                    example: { 'United States': 2, Canada: 1 },
                },
                lastSeen: { type: 'number', example: 1692616800000 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Get)('stats/summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDeviceStats", null);
exports.DevicesController = DevicesController = __decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Devices'),
    (0, common_1.Controller)('devices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseFilters)(mobile_exception_filter_1.MobileExceptionFilter),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map