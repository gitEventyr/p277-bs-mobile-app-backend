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
exports.VerifyEmailResponseDto = exports.VerifyEmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyEmailDto {
    code;
    newEmail;
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: '6-digit verification code received via email',
        minLength: 6,
        maxLength: 6,
        pattern: '^[0-9]{6}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Verification code must be exactly 6 digits' }),
    (0, class_validator_1.Matches)(/^[0-9]{6}$/, {
        message: 'Verification code must contain only numbers',
    }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New email address to update to (if updating email)',
        example: 'newemail@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Must be a valid email address' }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "newEmail", void 0);
class VerifyEmailResponseDto {
    message;
    emailVerified;
}
exports.VerifyEmailResponseDto = VerifyEmailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Email verified successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], VerifyEmailResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Email verification status',
    }),
    __metadata("design:type", Boolean)
], VerifyEmailResponseDto.prototype, "emailVerified", void 0);
//# sourceMappingURL=verify-email.dto.js.map