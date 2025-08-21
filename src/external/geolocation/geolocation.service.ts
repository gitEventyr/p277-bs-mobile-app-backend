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
      // In production, you would use a real geolocation API like:
      // - ipapi.co
      // - ipinfo.io
      // - freegeoip.app
      // For development, we'll mock the response

      const mockResponse = await this.mockGeolocationApi(ip);
      return mockResponse;
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

  private async mockGeolocationApi(
    ip: string,
  ): Promise<GeolocationResponseDto> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock different responses based on IP pattern
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
    } else if (firstSegment >= 51 && firstSegment <= 100) {
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
    } else if (firstSegment >= 101 && firstSegment <= 150) {
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
    } else {
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
