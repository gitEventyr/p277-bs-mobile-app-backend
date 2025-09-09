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
exports.PlaySessionResponseDto = exports.PlaySessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PlaySessionDto {
    bet;
    won;
    lost;
    game_name;
    game_mode;
    session_duration;
}
exports.PlaySessionDto = PlaySessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Amount bet in the game session',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Bet must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Bet amount must be 0 or greater' }),
    __metadata("design:type", Number)
], PlaySessionDto.prototype, "bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Amount won in the game session',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Won amount must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Won amount must be 0 or greater' }),
    __metadata("design:type", Number)
], PlaySessionDto.prototype, "won", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Amount lost in the game session',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Lost amount must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Lost amount must be 0 or greater' }),
    __metadata("design:type", Number)
], PlaySessionDto.prototype, "lost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Slot Machine Deluxe',
        description: 'Name of the game played',
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)({ message: 'Game name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Game name is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Game name cannot exceed 255 characters' }),
    __metadata("design:type", String)
], PlaySessionDto.prototype, "game_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'classic',
        description: 'Game mode or variant',
        required: false,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Game mode must be a string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Game mode cannot exceed 100 characters' }),
    __metadata("design:type", String)
], PlaySessionDto.prototype, "game_mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Session duration in minutes',
        required: false,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Session duration must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Session duration must be 0 or greater' }),
    __metadata("design:type", Number)
], PlaySessionDto.prototype, "session_duration", void 0);
class PlaySessionResponseDto {
    id;
    bet;
    won;
    lost;
    net_result;
    game_name;
    game_mode;
    session_duration;
    created_at;
    balance_change;
}
exports.PlaySessionResponseDto = PlaySessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Game session ID' }),
    __metadata("design:type", Number)
], PlaySessionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Amount bet' }),
    __metadata("design:type", Number)
], PlaySessionResponseDto.prototype, "bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Amount won' }),
    __metadata("design:type", Number)
], PlaySessionResponseDto.prototype, "won", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Amount lost' }),
    __metadata("design:type", Number)
], PlaySessionResponseDto.prototype, "lost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Net result (won - lost)' }),
    __metadata("design:type", Number)
], PlaySessionResponseDto.prototype, "net_result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Slot Machine Deluxe', description: 'Game name' }),
    __metadata("design:type", String)
], PlaySessionResponseDto.prototype, "game_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'classic',
        description: 'Game mode',
        required: false,
    }),
    __metadata("design:type", String)
], PlaySessionResponseDto.prototype, "game_mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Session duration in minutes',
        required: false,
    }),
    __metadata("design:type", Number)
], PlaySessionResponseDto.prototype, "session_duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-21T10:30:00Z',
        description: 'Session timestamp',
    }),
    __metadata("design:type", Date)
], PlaySessionResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            balance_before: 1000,
            balance_after: 1050,
            transaction_id: 123,
        },
        description: 'Balance change information',
        nullable: true,
    }),
    __metadata("design:type", Object)
], PlaySessionResponseDto.prototype, "balance_change", void 0);
//# sourceMappingURL=play-session.dto.js.map