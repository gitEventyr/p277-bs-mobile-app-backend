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
exports.MobileUserProfileDto = exports.DepositConfirmedDto = exports.RegistrationOfferDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RegistrationOfferDto {
    logo_url;
    id;
    public_name;
    offer_preheading;
    offer_heading;
    offer_subheading;
    terms_and_conditions;
    offer_link;
    is_active;
}
exports.RegistrationOfferDto = RegistrationOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino logo URL',
        example: 'https://example.com/logo.png',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "logo_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino external ID',
        example: 123,
    }),
    __metadata("design:type", Number)
], RegistrationOfferDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino public name',
        example: 'Mega Casino',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "public_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer pre-heading text',
        example: 'Welcome Bonus',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "offer_preheading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main offer heading',
        example: 'Get 100% Bonus + 50 Free Spins',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "offer_heading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer sub-heading text',
        example: 'Up to $500 + 50 Free Spins on Book of Dead',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "offer_subheading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Terms and conditions',
        example: 'Wagering requirements apply. 18+',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "terms_and_conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer link URL',
        example: 'https://casino.com/offer',
    }),
    __metadata("design:type", String)
], RegistrationOfferDto.prototype, "offer_link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the offer is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RegistrationOfferDto.prototype, "is_active", void 0);
class DepositConfirmedDto {
    public_name;
    action_date;
    rp_value;
}
exports.DepositConfirmedDto = DepositConfirmedDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino public name',
        example: 'Mega Casino',
    }),
    __metadata("design:type", String)
], DepositConfirmedDto.prototype, "public_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the deposit action',
        example: '2025-01-01T10:00:00Z',
    }),
    __metadata("design:type", Date)
], DepositConfirmedDto.prototype, "action_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RP value for this deposit (2000 for first deposit, 1000 for others)',
        example: 2000,
    }),
    __metadata("design:type", Number)
], DepositConfirmedDto.prototype, "rp_value", void 0);
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
    email_verified;
    email_verified_at;
    phone_verified;
    phone_verified_at;
    registration_offers;
    deposit_confirmed;
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
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether email is verified',
        example: false,
    }),
    __metadata("design:type", Boolean)
], MobileUserProfileDto.prototype, "email_verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email verification timestamp',
        example: '2025-01-01T10:00:00Z',
    }),
    __metadata("design:type", Date)
], MobileUserProfileDto.prototype, "email_verified_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether phone is verified',
        example: false,
    }),
    __metadata("design:type", Boolean)
], MobileUserProfileDto.prototype, "phone_verified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone verification timestamp',
        example: '2025-01-01T10:00:00Z',
    }),
    __metadata("design:type", Date)
], MobileUserProfileDto.prototype, "phone_verified_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of registration offers from casinos where user registered but never deposited',
        type: [RegistrationOfferDto],
    }),
    __metadata("design:type", Array)
], MobileUserProfileDto.prototype, "registration_offers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of first deposits data for each casino user deposited in',
        type: [DepositConfirmedDto],
    }),
    __metadata("design:type", Array)
], MobileUserProfileDto.prototype, "deposit_confirmed", void 0);
//# sourceMappingURL=mobile-user-profile.dto.js.map