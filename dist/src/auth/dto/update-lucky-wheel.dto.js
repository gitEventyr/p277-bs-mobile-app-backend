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
exports.UpdateLuckyWheelResponseDto = exports.UpdateLuckyWheelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateLuckyWheelDto {
    lucky_wheel_count;
}
exports.UpdateLuckyWheelDto = UpdateLuckyWheelDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lucky wheel count',
        example: 5,
        type: 'integer',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateLuckyWheelDto.prototype, "lucky_wheel_count", void 0);
class UpdateLuckyWheelResponseDto {
    message;
    lucky_wheel_count;
}
exports.UpdateLuckyWheelResponseDto = UpdateLuckyWheelResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Lucky wheel count updated successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], UpdateLuckyWheelResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated lucky wheel count',
        example: 5,
    }),
    __metadata("design:type", Number)
], UpdateLuckyWheelResponseDto.prototype, "lucky_wheel_count", void 0);
//# sourceMappingURL=update-lucky-wheel.dto.js.map