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
exports.UserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserProfileDto {
    id;
    visitor_id;
    name;
    email;
    phone;
    coins_balance;
    rp_balance;
    level;
    experience;
    scratch_cards;
    device_udid;
    subscription_agreement;
    tnc_agreement;
    os;
    device;
    created_at;
    updated_at;
    pid;
    c;
    af_channel;
    af_adset;
    af_ad;
    af_keywords;
    is_retargeting;
    af_click_lookback;
    af_viewthrough_lookback;
    af_sub1;
    af_sub2;
    af_sub3;
    af_sub4;
    af_sub5;
    email_verified;
    email_verified_at;
    phone_verified;
    phone_verified_at;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique visitor ID',
        example: 'visitor_abc123',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "visitor_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User display name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User email address',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+1234567890',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User coins balance',
        example: 1000,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "coins_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User RP balance',
        example: 0,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "rp_balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User level',
        example: 1,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User experience points',
        example: 0,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of scratch cards',
        example: 0,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "scratch_cards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device UDID',
        example: 'device-uuid-12345',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "device_udid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Subscription agreement status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "subscription_agreement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Terms and conditions agreement status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "tnc_agreement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operating system',
        example: 'iOS',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Device information',
        example: 'iPhone 14 Pro',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account creation date',
        example: '2024-01-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-01-01T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer PID',
        example: 'googleadwords_int',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "pid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer campaign',
        example: 'campaign_name',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "c", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer channel',
        example: 'google',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer adset',
        example: 'adset_name',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_adset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer ad',
        example: 'ad_name',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_ad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer keywords',
        example: ['casino', 'games'],
    }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "af_keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer retargeting flag',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "is_retargeting", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer click lookback period',
        example: 7,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "af_click_lookback", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer viewthrough lookback period',
        example: 1,
    }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "af_viewthrough_lookback", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer sub parameter 1',
        example: 'value1',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_sub1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer sub parameter 2',
        example: 'value2',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_sub2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer sub parameter 3',
        example: 'value3',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_sub3", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer sub parameter 4',
        example: 'value4',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_sub4", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AppsFlyer sub parameter 5',
        example: 'value5',
    }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "af_sub5", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether email is verified',
        example: false,
    }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "email_verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email verification timestamp',
        example: '2025-01-01T10:00:00Z',
    }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "email_verified_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether phone is verified',
        example: false,
    }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "phone_verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone verification timestamp',
        example: '2025-01-01T10:00:00Z',
    }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "phone_verified_at", void 0);
//# sourceMappingURL=user-profile.dto.js.map