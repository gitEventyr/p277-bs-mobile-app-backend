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
exports.MobileUserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MobileUserProfileDto {
    id;
    visitor_id;
    name;
    email;
    phone;
    coins_balance;
    rp_balance;
    level;
    scratch_cards;
}
exports.MobileUserProfileDto = MobileUserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], MobileUserProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique visitor ID',
        example: 'visitor_abc123',
    }),
    __metadata("design:type", String)
], MobileUserProfileDto.prototype, "visitor_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User display name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], MobileUserProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User email address',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", String)
], MobileUserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+1234567890',
    }),
    __metadata("design:type", String)
], MobileUserProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User coins balance',
        example: 1000,
    }),
    __metadata("design:type", Number)
], MobileUserProfileDto.prototype, "coins_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User RP balance',
        example: 0,
    }),
    __metadata("design:type", Number)
], MobileUserProfileDto.prototype, "rp_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User level',
        example: 1,
    }),
    __metadata("design:type", Number)
], MobileUserProfileDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of scratch cards',
        example: 0,
    }),
    __metadata("design:type", Number)
], MobileUserProfileDto.prototype, "scratch_cards", void 0);
//# sourceMappingURL=mobile-user-profile.dto.js.map