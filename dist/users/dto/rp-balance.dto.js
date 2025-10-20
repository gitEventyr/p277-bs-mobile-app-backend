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
exports.RpBalanceTransactionHistoryResponseDto = exports.RpBalanceTransactionHistoryDto = exports.RpBalanceChangeResponseDto = exports.ModifyRpBalanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ModifyRpBalanceDto {
    amount;
    reason;
}
exports.ModifyRpBalanceDto = ModifyRpBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount to modify (positive to increase, negative to decrease)',
        example: 100,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ModifyRpBalanceDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the balance change',
        example: 'Reward points earned',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ModifyRpBalanceDto.prototype, "reason", void 0);
class RpBalanceChangeResponseDto {
    balance_before;
    balance_after;
    amount;
    mode;
    transaction_id;
}
exports.RpBalanceChangeResponseDto = RpBalanceChangeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], RpBalanceChangeResponseDto.prototype, "balance_before", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 600 }),
    __metadata("design:type", Number)
], RpBalanceChangeResponseDto.prototype, "balance_after", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], RpBalanceChangeResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'increase' }),
    __metadata("design:type", String)
], RpBalanceChangeResponseDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12345 }),
    __metadata("design:type", Number)
], RpBalanceChangeResponseDto.prototype, "transaction_id", void 0);
class RpBalanceTransactionHistoryDto {
    id;
    balance_before;
    balance_after;
    amount;
    mode;
    reason;
    admin_id;
    created_at;
}
exports.RpBalanceTransactionHistoryDto = RpBalanceTransactionHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12345 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryDto.prototype, "balance_before", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 600 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryDto.prototype, "balance_after", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'increase' }),
    __metadata("design:type", String)
], RpBalanceTransactionHistoryDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Reward points earned', required: false }),
    __metadata("design:type", String)
], RpBalanceTransactionHistoryDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin-123', required: false }),
    __metadata("design:type", String)
], RpBalanceTransactionHistoryDto.prototype, "admin_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-20T10:00:00Z' }),
    __metadata("design:type", Date)
], RpBalanceTransactionHistoryDto.prototype, "created_at", void 0);
class RpBalanceTransactionHistoryResponseDto {
    data;
    total;
    page;
    limit;
    pages;
}
exports.RpBalanceTransactionHistoryResponseDto = RpBalanceTransactionHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RpBalanceTransactionHistoryDto] }),
    __metadata("design:type", Array)
], RpBalanceTransactionHistoryResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], RpBalanceTransactionHistoryResponseDto.prototype, "pages", void 0);
//# sourceMappingURL=rp-balance.dto.js.map