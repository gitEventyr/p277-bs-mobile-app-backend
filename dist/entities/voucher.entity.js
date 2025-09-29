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
exports.Voucher = exports.VoucherType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
var VoucherType;
(function (VoucherType) {
    VoucherType["AMAZON_GIFT_CARD"] = "Amazon Gift Card";
    VoucherType["OTHER"] = "Other";
})(VoucherType || (exports.VoucherType = VoucherType = {}));
let Voucher = class Voucher {
    id;
    name;
    rp_price;
    amazon_vouchers_equivalent;
    type;
    created_at;
    updated_at;
    voucherRequests;
};
exports.Voucher = Voucher;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], Voucher.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Voucher.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Voucher.prototype, "rp_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Voucher.prototype, "amazon_vouchers_equivalent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VoucherType }),
    (0, class_validator_1.IsEnum)(VoucherType),
    __metadata("design:type", String)
], Voucher.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Voucher.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Voucher.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('VoucherRequest', (voucherRequest) => voucherRequest.voucher),
    __metadata("design:type", Array)
], Voucher.prototype, "voucherRequests", void 0);
exports.Voucher = Voucher = __decorate([
    (0, typeorm_1.Entity)('vouchers')
], Voucher);
//# sourceMappingURL=voucher.entity.js.map