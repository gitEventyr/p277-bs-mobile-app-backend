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
exports.ConfirmAgeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ConfirmAgeResponseDto {
    message;
    age_verified;
    age_verified_at;
}
exports.ConfirmAgeResponseDto = ConfirmAgeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Age verified successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], ConfirmAgeResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Age verification status',
    }),
    __metadata("design:type", Boolean)
], ConfirmAgeResponseDto.prototype, "age_verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-15T10:30:00.000Z',
        description: 'Timestamp of age verification',
    }),
    __metadata("design:type", Date)
], ConfirmAgeResponseDto.prototype, "age_verified_at", void 0);
//# sourceMappingURL=confirm-age.dto.js.map