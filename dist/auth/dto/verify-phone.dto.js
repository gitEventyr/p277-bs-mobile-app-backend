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
exports.VerifyPhoneResponseDto = exports.VerifyPhoneDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyPhoneDto {
    code;
    newPhone;
}
exports.VerifyPhoneDto = VerifyPhoneDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: '6-digit verification code sent via SMS',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Code must be exactly 6 digits' }),
    __metadata("design:type", String)
], VerifyPhoneDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New phone number to update to (if updating phone)',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyPhoneDto.prototype, "newPhone", void 0);
class VerifyPhoneResponseDto {
    message;
    phoneVerified;
}
exports.VerifyPhoneResponseDto = VerifyPhoneResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Phone verified successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], VerifyPhoneResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Phone verification status',
    }),
    __metadata("design:type", Boolean)
], VerifyPhoneResponseDto.prototype, "phoneVerified", void 0);
//# sourceMappingURL=verify-phone.dto.js.map