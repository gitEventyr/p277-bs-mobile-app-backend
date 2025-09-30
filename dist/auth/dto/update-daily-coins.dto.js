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
exports.UpdateDailyCoinsResponseDto = exports.UpdateDailyCoinsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateDailyCoinsDto {
    daily_coins_days_count;
}
exports.UpdateDailyCoinsDto = UpdateDailyCoinsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Daily coins days count (max 7)',
        example: 3,
        type: 'integer',
        minimum: 0,
        maximum: 7,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], UpdateDailyCoinsDto.prototype, "daily_coins_days_count", void 0);
class UpdateDailyCoinsResponseDto {
    message;
    daily_coins_days_count;
    daily_coins_last_reward;
}
exports.UpdateDailyCoinsResponseDto = UpdateDailyCoinsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Daily coins updated successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], UpdateDailyCoinsResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated daily coins days count',
        example: 3,
    }),
    __metadata("design:type", Number)
], UpdateDailyCoinsResponseDto.prototype, "daily_coins_days_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of last reward',
        example: '2025-09-30T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UpdateDailyCoinsResponseDto.prototype, "daily_coins_last_reward", void 0);
//# sourceMappingURL=update-daily-coins.dto.js.map