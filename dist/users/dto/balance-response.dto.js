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
exports.TransactionHistoryResponseDto = exports.TransactionHistoryDto = exports.BalanceChangeResponseDto = exports.BalanceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class BalanceResponseDto {
    coins_balance;
    rp_balance;
    scratch_cards;
}
exports.BalanceResponseDto = BalanceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.75 }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "coins_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "rp_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], BalanceResponseDto.prototype, "scratch_cards", void 0);
class BalanceChangeResponseDto {
    balance_before;
    balance_after;
    amount;
    mode;
    transaction_id;
}
exports.BalanceChangeResponseDto = BalanceChangeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000.5 }),
    __metadata("design:type", Number)
], BalanceChangeResponseDto.prototype, "balance_before", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.75 }),
    __metadata("design:type", Number)
], BalanceChangeResponseDto.prototype, "balance_after", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500.25 }),
    __metadata("design:type", Number)
], BalanceChangeResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'game_win' }),
    __metadata("design:type", String)
], BalanceChangeResponseDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12345 }),
    __metadata("design:type", Number)
], BalanceChangeResponseDto.prototype, "transaction_id", void 0);
class TransactionHistoryDto {
    id;
    balance_before;
    balance_after;
    amount;
    mode;
    status;
    created_at;
    updated_at;
}
exports.TransactionHistoryDto = TransactionHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12345 }),
    __metadata("design:type", Number)
], TransactionHistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000.5 }),
    __metadata("design:type", Number)
], TransactionHistoryDto.prototype, "balance_before", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.75 }),
    __metadata("design:type", Number)
], TransactionHistoryDto.prototype, "balance_after", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500.25 }),
    __metadata("design:type", Number)
], TransactionHistoryDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'game_win' }),
    __metadata("design:type", String)
], TransactionHistoryDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'completed' }),
    __metadata("design:type", String)
], TransactionHistoryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-20T10:00:00Z' }),
    __metadata("design:type", Date)
], TransactionHistoryDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-20T10:00:00Z' }),
    __metadata("design:type", Date)
], TransactionHistoryDto.prototype, "updated_at", void 0);
class TransactionHistoryResponseDto {
    data;
    total;
    page;
    limit;
    pages;
}
exports.TransactionHistoryResponseDto = TransactionHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TransactionHistoryDto] }),
    __metadata("design:type", Array)
], TransactionHistoryResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    __metadata("design:type", Number)
], TransactionHistoryResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TransactionHistoryResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], TransactionHistoryResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], TransactionHistoryResponseDto.prototype, "pages", void 0);
//# sourceMappingURL=balance-response.dto.js.map