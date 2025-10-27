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
exports.UploadAvatarResponseDto = exports.UploadAvatarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UploadAvatarDto {
    avatar;
}
exports.UploadAvatarDto = UploadAvatarDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64 encoded image data (JPEG, PNG, or WebP)',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/]+=*$/, {
        message: 'Avatar must be a valid base64 encoded image (JPEG, PNG, or WebP)',
    }),
    __metadata("design:type", String)
], UploadAvatarDto.prototype, "avatar", void 0);
class UploadAvatarResponseDto {
    message;
    avatar;
}
exports.UploadAvatarResponseDto = UploadAvatarResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Avatar uploaded successfully' }),
    __metadata("design:type", String)
], UploadAvatarResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'data:image/png;base64,...' }),
    __metadata("design:type", String)
], UploadAvatarResponseDto.prototype, "avatar", void 0);
//# sourceMappingURL=avatar-upload.dto.js.map