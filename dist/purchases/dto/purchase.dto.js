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
exports.PurchaseResponseDto = exports.PurchaseHistoryQueryDto = exports.RecordPurchaseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RecordPurchaseDto {
    platform;
    product_id;
    transaction_id;
    amount;
    currency = 'USD';
    purchased_at;
    coins_amount;
    receipt_data;
}
exports.RecordPurchaseDto = RecordPurchaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Platform where the purchase was made',
        example: 'ios',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['ios', 'android']),
    __metadata("design:type", String)
], RecordPurchaseDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product identifier from the store',
        example: 'coins_100',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPurchaseDto.prototype, "product_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique transaction ID from the store',
        example: '1000000123456789',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPurchaseDto.prototype, "transaction_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Purchase amount in USD', example: 4.99 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RecordPurchaseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'USD',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPurchaseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the purchase was made',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RecordPurchaseDto.prototype, "purchased_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of coins to add to user balance',
        example: 1000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RecordPurchaseDto.prototype, "coins_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'iOS receipt data (base64 encoded)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPurchaseDto.prototype, "receipt_data", void 0);
class PurchaseHistoryQueryDto {
    page = 1;
    limit = 10;
    platform;
}
exports.PurchaseHistoryQueryDto = PurchaseHistoryQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page number', example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PurchaseHistoryQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page', example: 10, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PurchaseHistoryQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by platform',
        example: 'ios',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['ios', 'android']),
    __metadata("design:type", String)
], PurchaseHistoryQueryDto.prototype, "platform", void 0);
class PurchaseResponseDto {
    id;
    platform;
    product_id;
    transaction_id;
    amount;
    currency;
    purchased_at;
    created_at;
}
exports.PurchaseResponseDto = PurchaseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Purchase ID', example: 1 }),
    __metadata("design:type", Number)
], PurchaseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Platform', example: 'ios' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID', example: 'coins_100' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "product_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: '1000000123456789' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "transaction_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount', example: 4.99 }),
    __metadata("design:type", Number)
], PurchaseResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency', example: 'USD' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Purchase timestamp' }),
    __metadata("design:type", Date)
], PurchaseResponseDto.prototype, "purchased_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], PurchaseResponseDto.prototype, "created_at", void 0);
//# sourceMappingURL=purchase.dto.js.map