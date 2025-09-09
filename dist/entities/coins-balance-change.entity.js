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
exports.CoinsBalanceChange = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let CoinsBalanceChange = class CoinsBalanceChange {
    id;
    user_id;
    balance_before;
    balance_after;
    amount;
    mode;
    status;
    created_at;
    updated_at;
    user;
};
exports.CoinsBalanceChange = CoinsBalanceChange;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], CoinsBalanceChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], CoinsBalanceChange.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CoinsBalanceChange.prototype, "balance_before", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CoinsBalanceChange.prototype, "balance_after", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CoinsBalanceChange.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CoinsBalanceChange.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CoinsBalanceChange.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CoinsBalanceChange.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CoinsBalanceChange.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Player', (player) => player.balanceChanges),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], CoinsBalanceChange.prototype, "user", void 0);
exports.CoinsBalanceChange = CoinsBalanceChange = __decorate([
    (0, typeorm_1.Entity)('coins_balance_changes')
], CoinsBalanceChange);
//# sourceMappingURL=coins-balance-change.entity.js.map