import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';
import { GeolocationService } from '../../external/geolocation/geolocation.service';
import {
  DeviceResponseDto,
  DeviceListResponseDto,
  ParsedUserAgentDto,
  GeolocationResponseDto,
} from '../dto/device-response.dto';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly geolocationService: GeolocationService,
  ) {}

  async getUserDevices(userId: number): Promise<DeviceListResponseDto> {
    const devices = await this.deviceRepository.find({
      where: { user_id: userId },
      order: { logged_at: 'DESC' },
    });

    return {
      devices: devices.map((device) => this.mapToDeviceResponse(device)),
      total: devices.length,
    };
  }

  async getDeviceById(
    userId: number,
    deviceId: number,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId, user_id: userId },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return this.mapToDeviceResponse(device);
  }

  async createOrUpdateDevice(
    userId: number,
    udid: string,
    userAgent: string,
    ip: string,
  ): Promise<Device> {
    // Parse User Agent
    const parsedUA = this.parseUserAgent(userAgent);

    // Get geolocation data
    const location = await this.geolocationService.getLocationFromIp(ip);

    // Check if device already exists
    let device = await this.deviceRepository.findOne({
      where: { user_id: userId, udid },
    });

    if (device) {
      // Update existing device
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
    } else {
      // Create new device
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

  parseUserAgent(userAgent: string): ParsedUserAgentDto {
    if (!userAgent) {
      return {};
    }

    const result: ParsedUserAgentDto = {};

    try {
      // Parse OS information
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

      // Parse browser information
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

      // Parse device information
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

      // Default to desktop if no mobile/tablet detected
      if (!result.deviceType) {
        result.deviceType = 'Desktop';
        result.device = 'Computer';
      }
    } catch (error) {
      this.logger.error('Error parsing user agent:', error.message);
    }

    return result;
  }

  private formatBrowserString(parsedUA: ParsedUserAgentDto): string {
    if (!parsedUA.browser) return '';

    let browserString = parsedUA.browser;
    if (parsedUA.browserVersion) {
      browserString += `/${parsedUA.browserVersion}`;
    }

    return browserString;
  }

  private mapToDeviceResponse(device: Device): DeviceResponseDto {
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

  async getDeviceStats(userId: number) {
    const devices = await this.deviceRepository.find({
      where: { user_id: userId },
    });

    const stats = {
      totalDevices: devices.length,
      operatingSystems: {},
      browsers: {},
      countries: {},
      lastSeen:
        devices.length > 0
          ? Math.max(...devices.map((d) => d.logged_at.getTime()))
          : null,
    };

    devices.forEach((device) => {
      // Count OS types
      if (device.os_type) {
        stats.operatingSystems[device.os_type] =
          (stats.operatingSystems[device.os_type] || 0) + 1;
      }

      // Count browsers
      if (device.browser) {
        const browserName = device.browser.split('/')[0];
        stats.browsers[browserName] = (stats.browsers[browserName] || 0) + 1;
      }

      // Count countries
      if (device.country) {
        stats.countries[device.country] =
          (stats.countries[device.country] || 0) + 1;
      }
    });

    return stats;
  }
}
