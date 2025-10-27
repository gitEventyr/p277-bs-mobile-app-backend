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
exports.RegisterResponseDto = exports.RegisterDto = exports.AppsFlyerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AppsFlyerDto {
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
}
exports.AppsFlyerDto = AppsFlyerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'googleadwords_int', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "pid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'campaign_name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "c", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'google', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'adset_name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_adset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ad_name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_ad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'casino games', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AppsFlyerDto.prototype, "is_retargeting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppsFlyerDto.prototype, "af_click_lookback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppsFlyerDto.prototype, "af_viewthrough_lookback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'value1', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_sub1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'value2', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_sub2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'value3', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_sub3", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'value4', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_sub4", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'value5', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppsFlyerDto.prototype, "af_sub5", void 0);
class RegisterDto {
    email;
    name;
    phone;
    password;
    deviceUDID;
    subscription_agreement;
    tnc_agreement;
    os;
    device;
    appsflyer;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'User email address',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, {
        message: 'Please provide a valid email address (e.g., user@example.com)',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'User full name (2-100 characters)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Name cannot exceed 100 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1234567890',
        description: 'User phone number in international format',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Phone number must be a string' }),
    (0, class_validator_1.Matches)(/^\+[1-9]\d{1,14}$/, {
        message: 'Please provide a valid international phone number starting with + (e.g., +1234567890)',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'MyPassword123',
        description: 'User password (minimum 8 characters)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    (0, class_validator_1.Length)(8, 100, {
        message: 'Password must be between 8 and 100 characters long',
    }),
    (0, class_validator_1.Matches)(/^.{8,}$/, {
        message: 'Password must be at least 8 characters long',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'device-uuid-12345',
        description: 'Device unique identifier (3-255 characters)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Device UDID must be a string' }),
    (0, class_validator_1.Length)(3, 255, {
        message: 'Device UDID must be between 3 and 255 characters long',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "deviceUDID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Subscription agreement acceptance',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "subscription_agreement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Terms and conditions agreement acceptance',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "tnc_agreement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'iOS',
        description: 'Operating system',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'iPhone 14 Pro',
        description: 'Device model',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            pid: 'googleadwords_int',
            c: 'campaign_name',
            af_channel: 'google',
            af_adset: 'adset_name',
            af_ad: 'ad_name',
            af_keywords: 'casino games',
            is_retargeting: true,
            af_click_lookback: 7,
            af_viewthrough_lookback: 1,
            af_sub1: 'value1',
            af_sub2: 'value2',
            af_sub3: 'value3',
            af_sub4: 'value4',
            af_sub5: 'value5',
        },
        description: 'AppsFlyer attribution data',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AppsFlyerDto),
    __metadata("design:type", AppsFlyerDto)
], RegisterDto.prototype, "appsflyer", void 0);
class RegisterResponseDto {
    access_token;
    token_type;
    expires_in;
    user;
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bearer' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "token_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '30d' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "expires_in", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            visitor_id: 'visitor_abc123',
            email: 'john.doe@example.com',
            name: 'John Doe',
            coins_balance: 1000,
            rp_balance: 0,
            level: 1,
            scratch_cards: 0,
            ipaddress: '192.168.1.100',
            avatar: null,
        },
    }),
    __metadata("design:type", Object)
], RegisterResponseDto.prototype, "user", void 0);
//# sourceMappingURL=register.dto.js.map