"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GeolocationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
let GeolocationService = GeolocationService_1 = class GeolocationService {
    logger = new common_1.Logger(GeolocationService_1.name);
    async getLocationFromIp(ip) {
        if (this.isLocalIp(ip)) {
            return {
                ip,
                city: 'Local',
                region: 'Local',
                country: 'Local',
                countryCode: 'LC',
                isp: 'Local Network',
                timezone: 'UTC',
                lat: 0,
                lon: 0,
            };
        }
        try {
            const mockResponse = await this.mockGeolocationApi(ip);
            return mockResponse;
        }
        catch (error) {
            this.logger.error(`Failed to get geolocation for IP ${ip}:`, error.message);
            return {
                ip,
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                countryCode: 'XX',
                isp: 'Unknown ISP',
                timezone: 'UTC',
                lat: 0,
                lon: 0,
            };
        }
    }
    async mockGeolocationApi(ip) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const ipSegments = ip.split('.');
        const firstSegment = parseInt(ipSegments[0]);
        if (firstSegment >= 1 && firstSegment <= 50) {
            return {
                ip,
                city: 'New York',
                region: 'NY',
                country: 'United States',
                countryCode: 'US',
                isp: 'Verizon Communications',
                timezone: 'America/New_York',
                lat: 40.7128,
                lon: -74.006,
            };
        }
        else if (firstSegment >= 51 && firstSegment <= 100) {
            return {
                ip,
                city: 'London',
                region: 'England',
                country: 'United Kingdom',
                countryCode: 'GB',
                isp: 'British Telecom',
                timezone: 'Europe/London',
                lat: 51.5074,
                lon: -0.1278,
            };
        }
        else if (firstSegment >= 101 && firstSegment <= 150) {
            return {
                ip,
                city: 'Tokyo',
                region: 'Tokyo',
                country: 'Japan',
                countryCode: 'JP',
                isp: 'NTT Communications',
                timezone: 'Asia/Tokyo',
                lat: 35.6762,
                lon: 139.6503,
            };
        }
        else {
            return {
                ip,
                city: 'San Francisco',
                region: 'CA',
                country: 'United States',
                countryCode: 'US',
                isp: 'Comcast Cable',
                timezone: 'America/Los_Angeles',
                lat: 37.7749,
                lon: -122.4194,
            };
        }
    }
    isLocalIp(ip) {
        const localPatterns = [
            /^127\./,
            /^10\./,
            /^172\.(1[6-9]|2\d|3[01])\./,
            /^192\.168\./,
            /^::1$/,
            /^fe80:/,
            /^::ffff:127\./,
        ];
        return (localPatterns.some((pattern) => pattern.test(ip)) ||
            ip === '::1' ||
            ip === '::ffff:127.0.0.1' ||
            ip.includes('::ffff:127.0.0.1'));
    }
    async enrichLocationData(location) {
        return {
            ...location,
        };
    }
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = GeolocationService_1 = __decorate([
    (0, common_1.Injectable)()
], GeolocationService);
//# sourceMappingURL=geolocation.service.js.map