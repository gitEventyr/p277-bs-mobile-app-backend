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
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const games_service_1 = require("../services/games.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const play_session_dto_1 = require("../dto/play-session.dto");
const game_history_dto_1 = require("../dto/game-history.dto");
let GamesController = class GamesController {
    gamesService;
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    async recordPlaySession(user, playSessionDto) {
        return await this.gamesService.recordGameSession(user.id, playSessionDto);
    }
    async getGameHistory(user, filters) {
        return await this.gamesService.getGameHistory(user.id, filters);
    }
    async getGameSessionById(user, sessionId) {
        return await this.gamesService.getGameSessionById(user.id, sessionId);
    }
    async getGameStats(user) {
        return await this.gamesService.getGameStats(user.id);
    }
    async getPopularGames(limit) {
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return await this.gamesService.getPopularGames(limitNumber);
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Record a game session' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Game session recorded successfully',
        type: play_session_dto_1.PlaySessionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid game session data or insufficient balance',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Post)('play-session'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, play_session_dto_1.PlaySessionDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "recordPlaySession", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get player game history' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({
        name: 'game_name',
        required: false,
        type: String,
        example: 'Slot Machine',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort_by',
        required: false,
        enum: ['created_at', 'bet', 'won', 'net_result'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'sort_order', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Game history retrieved successfully',
        type: game_history_dto_1.GameHistoryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Get)('history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, game_history_dto_1.GameHistoryFilterDto]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGameHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get specific game session details' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Game session ID',
        type: 'integer',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Game session details retrieved successfully',
        type: game_history_dto_1.GameHistoryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Game session not found',
    }),
    (0, common_1.Get)('history/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGameSessionById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get player game statistics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Game statistics retrieved successfully',
        type: game_history_dto_1.GameStatsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Authentication required',
    }),
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGameStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get popular games (public endpoint)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Popular games retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    game_name: { type: 'string', example: 'Slot Machine Deluxe' },
                    play_count: { type: 'number', example: 1250 },
                },
            },
        },
    }),
    (0, common_1.Get)('popular'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getPopularGames", null);
exports.GamesController = GamesController = __decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Gaming'),
    (0, common_1.Controller)('games'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map