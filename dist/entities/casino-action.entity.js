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
exports.CasinoAction = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let CasinoAction = class CasinoAction {
    id;
    casino_name;
    date_of_action;
    visitor_id;
    registration;
    deposit;
    created_at;
    updated_at;
    casino;
    player;
};
exports.CasinoAction = CasinoAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], CasinoAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CasinoAction.prototype, "casino_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CasinoAction.prototype, "date_of_action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CasinoAction.prototype, "visitor_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CasinoAction.prototype, "registration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CasinoAction.prototype, "deposit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CasinoAction.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CasinoAction.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Casino', (casino) => casino.actions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'casino_name', referencedColumnName: 'casino_name' }),
    __metadata("design:type", Object)
], CasinoAction.prototype, "casino", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Player', (player) => player.casinoActions, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'visitor_id', referencedColumnName: 'visitor_id' }),
    __metadata("design:type", Object)
], CasinoAction.prototype, "player", void 0);
exports.CasinoAction = CasinoAction = __decorate([
    (0, typeorm_1.Entity)('casino_actions')
], CasinoAction);
//# sourceMappingURL=casino-action.entity.js.map