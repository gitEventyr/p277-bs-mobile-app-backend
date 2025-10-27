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
exports.CasinoOffersResponseDto = exports.CasinoOfferDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CasinoOfferDto {
    logo_url;
    id;
    public_name;
    offer_preheading;
    offer_heading;
    offer_subheading;
    terms_and_conditions;
    offer_link;
    is_active;
    button_label;
}
exports.CasinoOfferDto = CasinoOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino logo URL',
        example: 'https://example.com/logo.png',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "logo_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino external ID',
        example: 123,
    }),
    __metadata("design:type", Number)
], CasinoOfferDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Casino public name',
        example: 'Mega Casino',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "public_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer pre-heading text',
        example: 'Welcome Bonus',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "offer_preheading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main offer heading',
        example: 'Get 100% Bonus + 50 Free Spins',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "offer_heading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer sub-heading text',
        example: 'Up to $500 + 50 Free Spins on Book of Dead',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "offer_subheading", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Terms and conditions',
        example: 'Wagering requirements apply. 18+',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "terms_and_conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer link URL',
        example: 'https://casino.com/offer',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "offer_link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the offer is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CasinoOfferDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Button label text',
        example: 'Claim Bonus',
    }),
    __metadata("design:type", String)
], CasinoOfferDto.prototype, "button_label", void 0);
class CasinoOffersResponseDto {
    offers;
}
exports.CasinoOffersResponseDto = CasinoOffersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of available casino offers',
        type: [CasinoOfferDto],
    }),
    __metadata("design:type", Array)
], CasinoOffersResponseDto.prototype, "offers", void 0);
//# sourceMappingURL=casino-offers.dto.js.map