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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const purchases_service_1 = require("../services/purchases.service");
const mobile_exception_filter_1 = require("../../common/filters/mobile-exception.filter");
const purchase_dto_1 = require("../dto/purchase.dto");
let PurchasesController = class PurchasesController {
    purchasesService;
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
    }
    async recordPurchase(user, purchaseDto) {
        return this.purchasesService.recordPurchase(user.id, purchaseDto);
    }
    async getPurchaseHistory(user, queryDto) {
        return this.purchasesService.getPurchaseHistory(user.id, queryDto);
    }
    async getPurchaseStats(user) {
        return this.purchasesService.getPurchaseStats(user.id);
    }
    async getPurchaseById(user, purchaseId) {
        return this.purchasesService.getPurchaseById(user.id, purchaseId);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Post)('record'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Record in-app purchase',
        description: 'Records an in-app purchase transaction and adds coins to user balance',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Purchase recorded successfully',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        purchase: {
                            type: 'object',
                            properties: {
                                id: { type: 'number', example: 1 },
                                platform: { type: 'string', example: 'ios' },
                                product_id: { type: 'string', example: 'coins_100' },
                                transaction_id: { type: 'string', example: '1000000123456789' },
                                amount: { type: 'number', example: 4.99 },
                                currency: { type: 'string', example: 'USD' },
                                purchased_at: { type: 'string', format: 'date-time' },
                                created_at: { type: 'string', format: 'date-time' },
                            },
                        },
                        balance_update: {
                            type: 'object',
                            properties: {
                                balance_before: { type: 'number', example: 500 },
                                balance_after: { type: 'number', example: 1500 },
                                amount: { type: 'number', example: 1000 },
                                mode: { type: 'string', example: 'purchase_coins_100' },
                                transaction_id: { type: 'number', example: 123 },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid purchase data or validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Transaction already recorded (duplicate)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, purchase_dto_1.RecordPurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "recordPurchase", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get purchase history',
        description: "Retrieves user's purchase history with pagination and filtering",
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'platform', required: false, example: 'ios' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase history retrieved successfully',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number', example: 1 },
                                    platform: { type: 'string', example: 'ios' },
                                    product_id: { type: 'string', example: 'coins_100' },
                                    transaction_id: {
                                        type: 'string',
                                        example: '1000000123456789',
                                    },
                                    amount: { type: 'number', example: 4.99 },
                                    currency: { type: 'string', example: 'USD' },
                                    purchased_at: { type: 'string', format: 'date-time' },
                                    created_at: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                total: { type: 'number', example: 25 },
                                page: { type: 'number', example: 1 },
                                limit: { type: 'number', example: 10 },
                                pages: { type: 'number', example: 3 },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, purchase_dto_1.PurchaseHistoryQueryDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getPurchaseHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get purchase statistics',
        description: "Retrieves user's purchase statistics including total spent and recent purchases",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase statistics retrieved successfully',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        total_spent: { type: 'number', example: 49.95 },
                        total_purchases: { type: 'number', example: 10 },
                        recent_purchases: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number', example: 1 },
                                    product_id: { type: 'string', example: 'coins_100' },
                                    amount: { type: 'number', example: 4.99 },
                                    purchased_at: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getPurchaseStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get specific purchase',
        description: 'Retrieves details of a specific purchase by ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase details retrieved successfully',
        type: purchase_dto_1.PurchaseResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Purchase not found',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getPurchaseById", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Purchases'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('purchases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(mobile_exception_filter_1.MobileExceptionFilter),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService])
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map