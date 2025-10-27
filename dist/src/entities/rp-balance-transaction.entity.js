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
exports.RpBalanceTransaction = void 0;
const typeorm_1 = require("typeorm");
const player_entity_1 = require("./player.entity");
let RpBalanceTransaction = class RpBalanceTransaction {
    id;
    user_id;
    balance_before;
    balance_after;
    amount;
    mode;
    reason;
    admin_id;
    created_at;
    user;
};
exports.RpBalanceTransaction = RpBalanceTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], RpBalanceTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], RpBalanceTransaction.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], RpBalanceTransaction.prototype, "balance_before", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], RpBalanceTransaction.prototype, "balance_after", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], RpBalanceTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], RpBalanceTransaction.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RpBalanceTransaction.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], RpBalanceTransaction.prototype, "admin_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], RpBalanceTransaction.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => player_entity_1.Player, (player) => player.rpBalanceTransactions),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", player_entity_1.Player)
], RpBalanceTransaction.prototype, "user", void 0);
exports.RpBalanceTransaction = RpBalanceTransaction = __decorate([
    (0, typeorm_1.Entity)('rp_balance_transactions')
], RpBalanceTransaction);
//# sourceMappingURL=rp-balance-transaction.entity.js.map