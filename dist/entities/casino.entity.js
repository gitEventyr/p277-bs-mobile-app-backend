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
exports.Casino = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let Casino = class Casino {
    id;
    casino_name;
    casino_id;
    created_at;
    updated_at;
    actions;
};
exports.Casino = Casino;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], Casino.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Casino.prototype, "casino_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Casino.prototype, "casino_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Casino.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Casino.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('CasinoAction', (action) => action.casino),
    __metadata("design:type", Array)
], Casino.prototype, "actions", void 0);
exports.Casino = Casino = __decorate([
    (0, typeorm_1.Entity)('casinos')
], Casino);
//# sourceMappingURL=casino.entity.js.map