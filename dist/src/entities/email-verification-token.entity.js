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
exports.EmailVerificationToken = void 0;
const typeorm_1 = require("typeorm");
const player_entity_1 = require("./player.entity");
let EmailVerificationToken = class EmailVerificationToken {
    id;
    token;
    user_id;
    expires_at;
    used;
    created_at;
    user;
};
exports.EmailVerificationToken = EmailVerificationToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmailVerificationToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], EmailVerificationToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], EmailVerificationToken.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], EmailVerificationToken.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], EmailVerificationToken.prototype, "used", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], EmailVerificationToken.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => player_entity_1.Player),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", player_entity_1.Player)
], EmailVerificationToken.prototype, "user", void 0);
exports.EmailVerificationToken = EmailVerificationToken = __decorate([
    (0, typeorm_1.Entity)('email_verification_tokens')
], EmailVerificationToken);
//# sourceMappingURL=email-verification-token.entity.js.map