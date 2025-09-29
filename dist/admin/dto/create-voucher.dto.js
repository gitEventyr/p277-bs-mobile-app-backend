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
exports.CreateVoucherDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const voucher_entity_1 = require("../../entities/voucher.entity");
class CreateVoucherDto {
    name;
    rp_price;
    amazon_vouchers_equivalent;
    type;
}
exports.CreateVoucherDto = CreateVoucherDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Voucher name',
        example: 'Amazon eGift Card $25',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'RP price for the voucher', example: 2500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "rp_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Equivalent value in real money for admin reference',
        example: 25,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVoucherDto.prototype, "amazon_vouchers_equivalent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of voucher',
        enum: voucher_entity_1.VoucherType,
        example: voucher_entity_1.VoucherType.AMAZON_GIFT_CARD,
    }),
    (0, class_validator_1.IsEnum)(voucher_entity_1.VoucherType),
    __metadata("design:type", String)
], CreateVoucherDto.prototype, "type", void 0);
//# sourceMappingURL=create-voucher.dto.js.map