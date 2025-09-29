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
exports.VoucherRequest = exports.VoucherRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const player_entity_1 = require("./player.entity");
const voucher_entity_1 = require("./voucher.entity");
var VoucherRequestStatus;
(function (VoucherRequestStatus) {
    VoucherRequestStatus["REQUESTED"] = "requested";
    VoucherRequestStatus["SENT"] = "sent";
    VoucherRequestStatus["CANCELED"] = "canceled";
})(VoucherRequestStatus || (exports.VoucherRequestStatus = VoucherRequestStatus = {}));
let VoucherRequest = class VoucherRequest {
    id;
    user_id;
    voucher_id;
    request_date;
    status;
    created_at;
    updated_at;
    user;
    voucher;
};
exports.VoucherRequest = VoucherRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], VoucherRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], VoucherRequest.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], VoucherRequest.prototype, "voucher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], VoucherRequest.prototype, "request_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VoucherRequestStatus, default: VoucherRequestStatus.REQUESTED }),
    (0, class_validator_1.IsEnum)(VoucherRequestStatus),
    __metadata("design:type", String)
], VoucherRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], VoucherRequest.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], VoucherRequest.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => player_entity_1.Player, (player) => player.voucherRequests),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", player_entity_1.Player)
], VoucherRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.Voucher, (voucher) => voucher.voucherRequests),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.Voucher)
], VoucherRequest.prototype, "voucher", void 0);
exports.VoucherRequest = VoucherRequest = __decorate([
    (0, typeorm_1.Entity)('voucher_requests')
], VoucherRequest);
//# sourceMappingURL=voucher-request.entity.js.map