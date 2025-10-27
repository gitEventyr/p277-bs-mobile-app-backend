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
exports.InAppPurchase = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let InAppPurchase = class InAppPurchase {
    id;
    user_id;
    platform;
    product_id;
    transaction_id;
    amount;
    currency;
    purchased_at;
    created_at;
    updated_at;
    user;
};
exports.InAppPurchase = InAppPurchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], InAppPurchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], InAppPurchase.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InAppPurchase.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InAppPurchase.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InAppPurchase.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InAppPurchase.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'USD' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InAppPurchase.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], InAppPurchase.prototype, "purchased_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], InAppPurchase.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], InAppPurchase.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Player', (player) => player.purchases),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], InAppPurchase.prototype, "user", void 0);
exports.InAppPurchase = InAppPurchase = __decorate([
    (0, typeorm_1.Entity)('in_app_purchases')
], InAppPurchase);
//# sourceMappingURL=in-app-purchase.entity.js.map