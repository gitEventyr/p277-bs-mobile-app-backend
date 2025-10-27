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
exports.GeolocationResponseDto = exports.ParsedUserAgentDto = exports.DeviceListResponseDto = exports.DeviceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DeviceResponseDto {
    id;
    udid;
    os_type;
    os_version;
    browser;
    ip;
    city;
    country;
    isp;
    timezone;
    device_fb_id;
    logged_at;
    created_at;
    updated_at;
}
exports.DeviceResponseDto = DeviceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Device ID' }),
    __metadata("design:type", Number)
], DeviceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'device-uuid-12345', description: 'Device UDID' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "udid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iOS', description: 'Operating system type' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "os_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '16.5.1', description: 'Operating system version' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "os_version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Safari/605.1.15',
        description: 'Browser information',
    }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '192.168.1.100', description: 'IP address' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York', description: 'City name' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United States', description: 'Country name' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Verizon Communications',
        description: 'Internet Service Provider',
    }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "isp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'America/New_York', description: 'Timezone' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fb-device-123', description: 'Facebook device ID' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "device_fb_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-21T10:30:00Z',
        description: 'Last login timestamp',
    }),
    __metadata("design:type", Date)
], DeviceResponseDto.prototype, "logged_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-21T10:00:00Z',
        description: 'Device first seen',
    }),
    __metadata("design:type", Date)
], DeviceResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-08-21T10:30:00Z',
        description: 'Last device update',
    }),
    __metadata("design:type", Date)
], DeviceResponseDto.prototype, "updated_at", void 0);
class DeviceListResponseDto {
    devices;
    total;
}
exports.DeviceListResponseDto = DeviceListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [DeviceResponseDto],
        description: 'List of user devices',
    }),
    __metadata("design:type", Array)
], DeviceListResponseDto.prototype, "devices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total number of devices' }),
    __metadata("design:type", Number)
], DeviceListResponseDto.prototype, "total", void 0);
class ParsedUserAgentDto {
    os;
    osVersion;
    browser;
    browserVersion;
    device;
    deviceType;
}
exports.ParsedUserAgentDto = ParsedUserAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iOS', description: 'Operating system' }),
    __metadata("design:type", String)
], ParsedUserAgentDto.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '16.5.1', description: 'OS version' }),
    __metadata("design:type", String)
], ParsedUserAgentDto.prototype, "osVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Safari', description: 'Browser name' }),
    __metadata("design:type", String)
], ParsedUserAgentDto.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '605.1.15', description: 'Browser version' }),
    __metadata("design:type", String)
], ParsedUserAgentDto.prototype, "browserVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iPhone', description: 'Device type' }),
    __metadata("design:type", String)
], ParsedUserAgentDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mobile', description: 'Device category' }),
    __metadata("design:type", String)
], ParsedUserAgentDto.prototype, "deviceType", void 0);
class GeolocationResponseDto {
    ip;
    city;
    region;
    country;
    countryCode;
    isp;
    timezone;
    lat;
    lon;
}
exports.GeolocationResponseDto = GeolocationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '192.168.1.100', description: 'IP address' }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York', description: 'City name' }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NY', description: 'Region/State code' }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United States', description: 'Country name' }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'US', description: 'Country code' }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Verizon Communications',
        description: 'Internet Service Provider',
    }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "isp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'America/New_York', description: 'Timezone' }),
    __metadata("design:type", String)
], GeolocationResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40.7128, description: 'Latitude coordinate' }),
    __metadata("design:type", Number)
], GeolocationResponseDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -74.006, description: 'Longitude coordinate' }),
    __metadata("design:type", Number)
], GeolocationResponseDto.prototype, "lon", void 0);
//# sourceMappingURL=device-response.dto.js.map