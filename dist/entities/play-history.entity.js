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
exports.PlayHistory = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let PlayHistory = class PlayHistory {
    id;
    user_id;
    bet;
    won;
    lost;
    game_name;
    created_at;
    updated_at;
    user;
};
exports.PlayHistory = PlayHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' }),
    __metadata("design:type", Number)
], PlayHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], PlayHistory.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlayHistory.prototype, "bet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlayHistory.prototype, "won", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlayHistory.prototype, "lost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayHistory.prototype, "game_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], PlayHistory.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], PlayHistory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Player', (player) => player.playHistory),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], PlayHistory.prototype, "user", void 0);
exports.PlayHistory = PlayHistory = __decorate([
    (0, typeorm_1.Entity)('play_history')
], PlayHistory);
//# sourceMappingURL=play-history.entity.js.map