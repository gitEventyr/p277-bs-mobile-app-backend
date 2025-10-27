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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DevicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("../../entities/device.entity");
const geolocation_service_1 = require("../../external/geolocation/geolocation.service");
let DevicesService = DevicesService_1 = class DevicesService {
    deviceRepository;
    geolocationService;
    logger = new common_1.Logger(DevicesService_1.name);
    constructor(deviceRepository, geolocationService) {
        this.deviceRepository = deviceRepository;
        this.geolocationService = geolocationService;
    }
    async getUserDevices(userId) {
        const devices = await this.deviceRepository.find({
            where: { user_id: userId },
            order: { logged_at: 'DESC' },
        });
        return {
            devices: devices.map((device) => this.mapToDeviceResponse(device)),
            total: devices.length,
        };
    }
    async getDeviceById(userId, deviceId) {
        const device = await this.deviceRepository.findOne({
            where: { id: deviceId, user_id: userId },
        });
        if (!device) {
            throw new common_1.NotFoundException('Device not found');
        }
        return this.mapToDeviceResponse(device);
    }
    async createOrUpdateDevice(userId, udid, userAgent, ip) {
        const parsedUA = this.parseUserAgent(userAgent);
        const location = await this.geolocationService.getLocationFromIp(ip);
        let device = await this.deviceRepository.findOne({
            where: { user_id: userId, udid },
        });
        if (device) {
            device.os_type = parsedUA.os || device.os_type;
            device.os_version = parsedUA.osVersion || device.os_version;
            device.browser = this.formatBrowserString(parsedUA) || device.browser;
            device.ip = ip;
            device.city = location.city || device.city;
            device.country = location.country || device.country;
            device.isp = location.isp || device.isp;
            device.timezone = location.timezone || device.timezone;
            device.logged_at = new Date();
            this.logger.log(`Updating device ${udid} for user ${userId}`);
        }
        else {
            device = this.deviceRepository.create({
                user_id: userId,
                udid,
                os_type: parsedUA.os,
                os_version: parsedUA.osVersion,
                browser: this.formatBrowserString(parsedUA),
                ip,
                city: location.city,
                country: location.country,
                isp: location.isp,
                timezone: location.timezone,
                logged_at: new Date(),
            });
            this.logger.log(`Creating new device ${udid} for user ${userId}`);
        }
        return await this.deviceRepository.save(device);
    }
    parseUserAgent(userAgent) {
        if (!userAgent) {
            return {};
        }
        const result = {};
        try {
            const osPatterns = [
                { pattern: /Windows NT ([\d.]+)/, name: 'Windows', versionIndex: 1 },
                {
                    pattern: /Mac OS X ([\d_]+)/,
                    name: 'macOS',
                    versionIndex: 1,
                    versionReplace: /_/g,
                },
                {
                    pattern: /iPhone OS ([\d_]+)/,
                    name: 'iOS',
                    versionIndex: 1,
                    versionReplace: /_/g,
                },
                { pattern: /Android ([\d.]+)/, name: 'Android', versionIndex: 1 },
                { pattern: /Linux/, name: 'Linux' },
                { pattern: /CrOS/, name: 'Chrome OS' },
            ];
            for (const osPattern of osPatterns) {
                const match = userAgent.match(osPattern.pattern);
                if (match) {
                    result.os = osPattern.name;
                    if (osPattern.versionIndex && match[osPattern.versionIndex]) {
                        let version = match[osPattern.versionIndex];
                        if (osPattern.versionReplace) {
                            version = version.replace(osPattern.versionReplace, '.');
                        }
                        result.osVersion = version;
                    }
                    break;
                }
            }
            const browserPatterns = [
                { pattern: /Chrome\/([\d.]+)/, name: 'Chrome' },
                { pattern: /Firefox\/([\d.]+)/, name: 'Firefox' },
                {
                    pattern: /Safari\/([\d.]+).*Version\/([\d.]+)/,
                    name: 'Safari',
                    versionIndex: 2,
                },
                { pattern: /Edge\/([\d.]+)/, name: 'Edge' },
                { pattern: /Opera\/([\d.]+)/, name: 'Opera' },
                { pattern: /Trident\/.*rv:([\d.]+)/, name: 'Internet Explorer' },
            ];
            for (const browserPattern of browserPatterns) {
                const match = userAgent.match(browserPattern.pattern);
                if (match) {
                    result.browser = browserPattern.name;
                    const versionIndex = browserPattern.versionIndex || 1;
                    if (match[versionIndex]) {
                        result.browserVersion = match[versionIndex];
                    }
                    break;
                }
            }
            const devicePatterns = [
                { pattern: /iPhone/, name: 'iPhone', type: 'Mobile' },
                { pattern: /iPad/, name: 'iPad', type: 'Tablet' },
                { pattern: /Android.*Mobile/, name: 'Android Phone', type: 'Mobile' },
                { pattern: /Android/, name: 'Android Tablet', type: 'Tablet' },
                { pattern: /Windows Phone/, name: 'Windows Phone', type: 'Mobile' },
            ];
            for (const devicePattern of devicePatterns) {
                if (userAgent.match(devicePattern.pattern)) {
                    result.device = devicePattern.name;
                    result.deviceType = devicePattern.type;
                    break;
                }
            }
            if (!result.deviceType) {
                result.deviceType = 'Desktop';
                result.device = 'Computer';
            }
        }
        catch (error) {
            this.logger.error('Error parsing user agent:', error.message);
        }
        return result;
    }
    formatBrowserString(parsedUA) {
        if (!parsedUA.browser)
            return '';
        let browserString = parsedUA.browser;
        if (parsedUA.browserVersion) {
            browserString += `/${parsedUA.browserVersion}`;
        }
        return browserString;
    }
    mapToDeviceResponse(device) {
        return {
            id: device.id,
            udid: device.udid,
            os_type: device.os_type,
            os_version: device.os_version,
            browser: device.browser,
            ip: device.ip,
            city: device.city,
            country: device.country,
            isp: device.isp,
            timezone: device.timezone,
            device_fb_id: device.device_fb_id,
            logged_at: device.logged_at,
            created_at: device.created_at,
            updated_at: device.updated_at,
        };
    }
    async getDeviceStats(userId) {
        const devices = await this.deviceRepository.find({
            where: { user_id: userId },
        });
        const stats = {
            totalDevices: devices.length,
            operatingSystems: {},
            browsers: {},
            countries: {},
            lastSeen: devices.length > 0
                ? Math.max(...devices.map((d) => d.logged_at.getTime()))
                : null,
        };
        devices.forEach((device) => {
            if (device.os_type) {
                stats.operatingSystems[device.os_type] =
                    (stats.operatingSystems[device.os_type] || 0) + 1;
            }
            if (device.browser) {
                const browserName = device.browser.split('/')[0];
                stats.browsers[browserName] = (stats.browsers[browserName] || 0) + 1;
            }
            if (device.country) {
                stats.countries[device.country] =
                    (stats.countries[device.country] || 0) + 1;
            }
        });
        return stats;
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = DevicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        geolocation_service_1.GeolocationService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map