import { Injectable, Logger } from '@nestjs/common';
import { GeolocationResponseDto } from '../../devices/dto/device-response.dto';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);

  async getLocationFromIp(ip: string): Promise<GeolocationResponseDto> {
    // Skip geolocation for local IPs
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
      // Use ip-api.com for real geolocation data
      // Free tier: 45 requests per minute, no API key required
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the API returned an error
      if (data.status === 'fail') {
        this.logger.warn(
          `IP-API returned error for ${ip}: ${data.message || 'Unknown error'}`,
        );
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
    } catch (error) {
      this.logger.error(
        `Failed to get geolocation for IP ${ip}:`,
        error.message,
      );

      // Return fallback data
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


  private isLocalIp(ip: string): boolean {
    // Check for local/private IP ranges
    const localPatterns = [
      /^127\./, // 127.0.0.0/8 (localhost)
      /^10\./, // 10.0.0.0/8 (private)
      /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12 (private)
      /^192\.168\./, // 192.168.0.0/16 (private)
      /^::1$/, // IPv6 localhost
      /^fe80:/, // IPv6 link-local
      /^::ffff:127\./, // IPv4-mapped IPv6 localhost
    ];

    return (
      localPatterns.some((pattern) => pattern.test(ip)) ||
      ip === '::1' ||
      ip === '::ffff:127.0.0.1' ||
      ip.includes('::ffff:127.0.0.1')
    );
  }

  async enrichLocationData(
    location: GeolocationResponseDto,
  ): Promise<GeolocationResponseDto> {
    // Additional enrichment could be done here
    // For example, getting ISP information, carrier data, etc.
    return {
      ...location,
      // Add any additional enriched data
    };
  }
}
