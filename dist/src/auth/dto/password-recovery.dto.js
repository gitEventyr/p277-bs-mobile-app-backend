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
exports.ResetPasswordResponseDto = exports.PasswordRecoveryResponseDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ForgotPasswordDto {
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email address to send password reset code',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
    email;
    code;
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email address associated with the account',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: '6-digit password reset code received in email',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Reset code must be exactly 6 digits' }),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: 'Reset code must contain only digits' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'MyPassword123',
        description: 'New password (minimum 8 characters)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 100, {
        message: 'Password must be between 8 and 100 characters long',
    }),
    (0, class_validator_1.Matches)(/^.{8,}$/, {
        message: 'Password must be at least 8 characters long',
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class PasswordRecoveryResponseDto {
    message;
}
exports.PasswordRecoveryResponseDto = PasswordRecoveryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password reset email sent successfully' }),
    __metadata("design:type", String)
], PasswordRecoveryResponseDto.prototype, "message", void 0);
class ResetPasswordResponseDto {
    message;
}
exports.ResetPasswordResponseDto = ResetPasswordResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password reset successfully' }),
    __metadata("design:type", String)
], ResetPasswordResponseDto.prototype, "message", void 0);
//# sourceMappingURL=password-recovery.dto.js.map