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
            const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'fail') {
                this.logger.warn(`IP-API returned error for ${ip}: ${data.message || 'Unknown error'}`);
                throw new Error(data.message || 'IP-API request failed');
            }
            return {
                ip: data.query || ip,
                city: data.city || 'Unknown',
                region: data.regionName || data.region || 'Unknown',
                country: data.country || 'Unknown',
                countryCode: data.countryCode || 'XX',
                isp: data.isp || 'Unknown ISP',
                timezone: data.timezone || 'UTC',
                lat: data.lat || 0,
                lon: data.lon || 0,
            };
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