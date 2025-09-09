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
exports.AdminBalanceAdjustmentDto = exports.ModifyBalanceDto = exports.BalanceChangeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BalanceChangeDto {
    amount;
    mode;
    description;
}
exports.BalanceChangeDto = BalanceChangeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100.5,
        description: 'Amount to change (positive number)',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Amount must be greater than 0' }),
    __metadata("design:type", Number)
], BalanceChangeDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'game_win',
        description: 'Mode of balance change',
        enum: [
            'game_win',
            'game_loss',
            'purchase',
            'bet',
            'admin_adjustment',
            'bonus',
            'refund',
            'increase',
            'decrease',
        ],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BalanceChangeDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Win from Slot Machine - Session 123',
        description: 'Description of the balance change',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BalanceChangeDto.prototype, "description", void 0);
class ModifyBalanceDto {
    amount;
    mode;
    description;
}
exports.ModifyBalanceDto = ModifyBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100.5,
        description: 'Amount to modify (positive for increase, negative for decrease)',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ModifyBalanceDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'game_win',
        description: 'Mode of balance change',
        enum: [
            'game_win',
            'game_loss',
            'purchase',
            'bet',
            'admin_adjustment',
            'bonus',
            'refund',
        ],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModifyBalanceDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Win from Slot Machine - Session 123',
        description: 'Description of the balance change',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModifyBalanceDto.prototype, "description", void 0);
class AdminBalanceAdjustmentDto {
    amount;
    reason;
}
exports.AdminBalanceAdjustmentDto = AdminBalanceAdjustmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100.5,
        description: 'Amount to adjust (can be positive or negative)',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AdminBalanceAdjustmentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'compensation_for_issue',
        description: 'Reason for balance adjustment',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminBalanceAdjustmentDto.prototype, "reason", void 0);
//# sourceMappingURL=balance-change.dto.js.map