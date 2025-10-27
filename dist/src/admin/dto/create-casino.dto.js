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
exports.CreateCasinoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCasinoDto {
    casino_name;
    casino_id;
}
exports.CreateCasinoDto = CreateCasinoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the casino',
        example: 'Bella Vegas Casino',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "casino_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'External casino ID for third-party API integration (must be numeric)',
        example: '123',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)({}, { message: 'Casino ID must contain only numeric characters' }),
    __metadata("design:type", String)
], CreateCasinoDto.prototype, "casino_id", void 0);
//# sourceMappingURL=create-casino.dto.js.map