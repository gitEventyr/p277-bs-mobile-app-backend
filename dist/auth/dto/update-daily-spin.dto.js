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
exports.UpdateDailySpinResponseDto = exports.UpdateDailySpinDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateDailySpinDto {
    daily_spin_wheel_day_count;
    daily_spin_wheel_last_spin;
}
exports.UpdateDailySpinDto = UpdateDailySpinDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Daily spin wheel day count',
        example: 1,
        type: 'integer',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDailySpinDto.prototype, "daily_spin_wheel_day_count", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional timestamp for last spin (ISO 8601 format). If not provided, current time will be used.',
        example: '2025-09-30T12:00:00.000Z',
        type: 'string',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDailySpinDto.prototype, "daily_spin_wheel_last_spin", void 0);
class UpdateDailySpinResponseDto {
    message;
    daily_spin_wheel_day_count;
    daily_spin_wheel_last_spin;
}
exports.UpdateDailySpinResponseDto = UpdateDailySpinResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Daily spin updated successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], UpdateDailySpinResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated daily spin wheel day count',
        example: 1,
    }),
    __metadata("design:type", Number)
], UpdateDailySpinResponseDto.prototype, "daily_spin_wheel_day_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of last spin',
        example: '2025-09-30T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UpdateDailySpinResponseDto.prototype, "daily_spin_wheel_last_spin", void 0);
//# sourceMappingURL=update-daily-spin.dto.js.map