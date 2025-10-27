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
exports.GameStatsDto = exports.GameHistoryResponseDto = exports.GameHistoryDto = exports.GameHistoryFilterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GameHistoryFilterDto {
    page = 1;
    limit = 10;
    game_name;
    sort_by = 'created_at';
    sort_order = 'desc';
}
exports.GameHistoryFilterDto = GameHistoryFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Page number for pagination',
        required: false,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Page must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    __metadata("design:type", Number)
], GameHistoryFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of items per page',
        required: false,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    __metadata("design:type", Number)
], GameHistoryFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Slot Machine Deluxe',
        description: 'Filter by game name',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Game name filter must be a string' }),
    __metadata("design:type", String)
], GameHistoryFilterDto.prototype, "game_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'created_at',
        description: 'Field to sort by',
        required: false,
        enum: ['created_at', 'bet', 'won', 'net_result'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['created_at', 'bet', 'won', 'net_result'], {
        message: 'Sort by must be one of: created_at, bet, won, net_result',
    }),
    __metadata("design:type", String)
], GameHistoryFilterDto.prototype, "sort_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'desc',
        description: 'Sort order',
        required: false,
        enum: ['asc', 'desc'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['asc', 'desc'], {
        message: 'Sort order must be either asc or desc',
    }),
    __metadata("design:type", String)
], GameHistoryFilterDto.prototype, "sort_order", void 0);
class GameHistoryDto {
    id;
    bet;
    won;
    lost;
    net_result;
    game_name;
    game_mode;
    session_duration;
    created_at;
}
exports.GameHistoryDto = GameHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Game session ID' }),
    __metadata("design:type", Number)
], GameHistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Amount bet' }),
    __metadata("design:type", Number)
], GameHistoryDto.prototype, "bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Amount won' }),
    __metadata("design:type", Number)
], GameHistoryDto.prototype, "won", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Amount lost' }),
    __metadata("design:type", Number)
], GameHistoryDto.prototype, "lost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Net result (won - lost)' }),
    __metadata("design:type", Number)
], GameHistoryDto.prototype, "net_result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Slot Machine Deluxe', description: 'Game name' }),
    __metadata("design:type", String)
], GameHistoryDto.prototype, "game_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'classic',
        description: 'Game mode',
        required: false,
    }),
    __metadata("design:type", String)
], GameHistoryDto.prototype, "game_mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Session duration in minutes',
        required: false,
    }),
    __metadata("design:type", Number)
], GameHistoryDto.prototype, "session_duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-21T10:30:00Z',
        description: 'Session timestamp',
    }),
    __metadata("design:type", Date)
], GameHistoryDto.prototype, "created_at", void 0);
class GameHistoryResponseDto {
    sessions;
    total;
    page;
    limit;
    total_pages;
}
exports.GameHistoryResponseDto = GameHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [GameHistoryDto],
        description: 'List of game sessions',
    }),
    __metadata("design:type", Array)
], GameHistoryResponseDto.prototype, "sessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total number of sessions' }),
    __metadata("design:type", Number)
], GameHistoryResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Current page number' }),
    __metadata("design:type", Number)
], GameHistoryResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Items per page' }),
    __metadata("design:type", Number)
], GameHistoryResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total number of pages' }),
    __metadata("design:type", Number)
], GameHistoryResponseDto.prototype, "total_pages", void 0);
class GameStatsDto {
    total_sessions;
    total_bet;
    total_won;
    total_lost;
    net_result;
    rtp_percentage;
    average_bet;
    average_won;
    games_played;
    game_breakdown;
    last_session;
    first_session;
}
exports.GameStatsDto = GameStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Total number of game sessions' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "total_sessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250, description: 'Total amount bet' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "total_bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1100, description: 'Total amount won' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "total_won", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250, description: 'Total amount lost' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "total_lost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: -150,
        description: 'Net result (total won - total lost)',
    }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "net_result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.88, description: 'Return to player percentage' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "rtp_percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Average bet amount' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "average_bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 44, description: 'Average won amount' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "average_won", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Number of different games played' }),
    __metadata("design:type", Number)
], GameStatsDto.prototype, "games_played", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { 'Slot Machine Deluxe': 15, 'Poker Pro': 8, Blackjack: 2 },
        description: 'Games played breakdown',
    }),
    __metadata("design:type", Object)
], GameStatsDto.prototype, "game_breakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-21T10:30:00Z',
        description: 'Last game session timestamp',
        nullable: true,
    }),
    __metadata("design:type", Object)
], GameStatsDto.prototype, "last_session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-15T09:15:00Z',
        description: 'First game session timestamp',
        nullable: true,
    }),
    __metadata("design:type", Object)
], GameStatsDto.prototype, "first_session", void 0);
//# sourceMappingURL=game-history.dto.js.map