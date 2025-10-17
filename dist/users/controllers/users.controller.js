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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("../services/users.service");
const balance_service_1 = require("../services/balance.service");
const rp_balance_service_1 = require("../services/rp-balance.service");
const casino_offers_service_1 = require("../services/casino-offers.service");
const update_profile_dto_1 = require("../dto/update-profile.dto");
const update_level_dto_1 = require("../dto/update-level.dto");
const update_scratch_cards_dto_1 = require("../dto/update-scratch-cards.dto");
const update_experience_dto_1 = require("../dto/update-experience.dto");
const mobile_user_profile_dto_1 = require("../dto/mobile-user-profile.dto");
const balance_change_dto_1 = require("../dto/balance-change.dto");
const rp_balance_dto_1 = require("../dto/rp-balance.dto");
const balance_response_dto_1 = require("../dto/balance-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const mobile_exception_filter_1 = require("../../common/filters/mobile-exception.filter");
const casino_offers_dto_1 = require("../dto/casino-offers.dto");
let UsersController = class UsersController {
    usersService;
    balanceService;
    rpBalanceService;
    casinoOffersService;
    constructor(usersService, balanceService, rpBalanceService, casinoOffersService) {
        this.usersService = usersService;
        this.balanceService = balanceService;
        this.rpBalanceService = rpBalanceService;
        this.casinoOffersService = casinoOffersService;
    }
    async getProfile(user) {
        return await this.usersService.getMobileProfile(user.id);
    }
    async updateProfile(user, updateProfileDto) {
        await this.usersService.updateProfile(user.id, updateProfileDto);
        return await this.usersService.getMobileProfile(user.id);
    }
    async getBalance(user) {
        return await this.balanceService.getBalance(user.id);
    }
    async modifyBalance(user, modifyBalanceDto) {
        return await this.balanceService.modifyBalance(user.id, modifyBalanceDto);
    }
    async getTransactionHistory(user, page = 1, limit = 10) {
        return await this.balanceService.getTransactionHistory(user.id, Number(page), Number(limit));
    }
    async getTransactionById(user, transactionId) {
        return await this.balanceService.getTransactionById(user.id, transactionId);
    }
    async updateLevel(user, updateLevelDto) {
        await this.usersService.updateProfile(user.id, {
            level: updateLevelDto.level,
        });
        return await this.usersService.getMobileProfile(user.id);
    }
    async updateScratchCards(user, updateScratchCardsDto) {
        await this.usersService.updateProfile(user.id, {
            scratch_cards: updateScratchCardsDto.scratch_cards,
        });
        return await this.usersService.getMobileProfile(user.id);
    }
    async updateExperience(user, updateExperienceDto) {
        await this.usersService.updateProfile(user.id, {
            experience: updateExperienceDto.experience,
        });
        return await this.usersService.getMobileProfile(user.id);
    }
    async modifyRpBalance(user, modifyRpBalanceDto) {
        return await this.rpBalanceService.modifyRpBalance(user.id, modifyRpBalanceDto);
    }
    async getRpTransactionHistory(user, page = 1, limit = 10) {
        return await this.rpBalanceService.getRpTransactionHistory(user.id, Number(page), Number(limit));
    }
    getClientIp(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            '127.0.0.1');
    }
    async getCasinoOffers(user, req) {
        const offers = await this.casinoOffersService.getCasinoOffers(user.id, this.getClientIp(req));
        return { offers };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: User Profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User profile retrieved successfully',
        type: mobile_user_profile_dto_1.MobileUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: User Profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User profile updated successfully',
        type: mobile_user_profile_dto_1.MobileUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or email already in use',
    }),
    (0, common_1.Put)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Balance & Transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current balance and scratch cards' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Balance retrieved successfully',
        type: balance_response_dto_1.BalanceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, common_1.Get)('balance'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getBalance", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Balance & Transactions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modify balance',
        description: 'Modify user balance - positive amounts increase, negative amounts decrease',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Balance modified successfully',
        type: balance_response_dto_1.BalanceChangeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid amount or insufficient balance',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, common_1.Post)('modify-balance'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, balance_change_dto_1.ModifyBalanceDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "modifyBalance", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Balance & Transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transaction history retrieved successfully',
        type: balance_response_dto_1.TransactionHistoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Get)('history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTransactionHistory", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Balance & Transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific transaction details' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transaction details retrieved successfully',
        type: balance_response_dto_1.TransactionHistoryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Transaction not found',
    }),
    (0, common_1.Get)('history/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTransactionById", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: User Profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user level' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User level updated successfully',
        type: mobile_user_profile_dto_1.MobileUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid level value',
    }),
    (0, common_1.Put)('level'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_level_dto_1.UpdateLevelDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLevel", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: User Profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update scratch cards count' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Scratch cards count updated successfully',
        type: mobile_user_profile_dto_1.MobileUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid scratch cards value',
    }),
    (0, common_1.Put)('scratch-cards'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_scratch_cards_dto_1.UpdateScratchCardsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateScratchCards", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: User Profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user experience' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User experience updated successfully',
        type: mobile_user_profile_dto_1.MobileUserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid experience value',
    }),
    (0, common_1.Put)('experience'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_experience_dto_1.UpdateExperienceDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateExperience", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Balance & Transactions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Modify user RP balance',
        description: 'Modify user RP balance - positive amounts increase, negative amounts decrease',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RP balance modified successfully',
        type: rp_balance_dto_1.RpBalanceChangeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid amount or insufficient balance',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'User not found',
    }),
    (0, common_1.Post)('modify-rp-balance'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rp_balance_dto_1.ModifyRpBalanceDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "modifyRpBalance", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Balance & Transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get RP balance transaction history' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'RP transaction history retrieved successfully',
        type: rp_balance_dto_1.RpBalanceTransactionHistoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Get)('rp-history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRpTransactionHistory", null);
__decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: User Profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get casino offers for user',
        description: 'Get personalized casino offers excluding casinos where user has made deposits',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Casino offers retrieved successfully',
        type: casino_offers_dto_1.CasinoOffersResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'User not found or casino API error',
    }),
    (0, common_1.Get)('casino-offers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCasinoOffers", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseFilters)(mobile_exception_filter_1.MobileExceptionFilter),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        balance_service_1.BalanceService,
        rp_balance_service_1.RpBalanceService,
        casino_offers_service_1.CasinoOffersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map