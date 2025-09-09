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
exports.UserVoucher = void 0;
const typeorm_1 = require("typeorm");
let UserVoucher = class UserVoucher {
    id;
    user_id;
    voucher_id;
    created_at;
    updated_at;
    user;
    voucher;
};
exports.UserVoucher = UserVoucher;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], UserVoucher.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], UserVoucher.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], UserVoucher.prototype, "voucher_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], UserVoucher.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], UserVoucher.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Player', (player) => player.userVouchers),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], UserVoucher.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Voucher', (voucher) => voucher.userVouchers),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", Object)
], UserVoucher.prototype, "voucher", void 0);
exports.UserVoucher = UserVoucher = __decorate([
    (0, typeorm_1.Entity)('users_vouchers')
], UserVoucher);
//# sourceMappingURL=user-voucher.entity.js.map