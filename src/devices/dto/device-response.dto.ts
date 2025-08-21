import { ApiProperty } from '@nestjs/swagger';

export class DeviceResponseDto {
  @ApiProperty({ example: 1, description: 'Device ID' })
  id: number;

  @ApiProperty({ example: 'device-uuid-12345', description: 'Device UDID' })
  udid: string;

  @ApiProperty({ example: 'iOS', description: 'Operating system type' })
  os_type?: string;

  @ApiProperty({ example: '16.5.1', description: 'Operating system version' })
  os_version?: string;

  @ApiProperty({ example: 'Safari/605.1.15', description: 'Browser information' })
  browser?: string;

  @ApiProperty({ example: '192.168.1.100', description: 'IP address' })
  ip?: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  city?: string;

  @ApiProperty({ example: 'United States', description: 'Country name' })
  country?: string;

  @ApiProperty({ example: 'Verizon Communications', description: 'Internet Service Provider' })
  isp?: string;

  @ApiProperty({ example: 'America/New_York', description: 'Timezone' })
  timezone?: string;

  @ApiProperty({ example: 'fb-device-123', description: 'Facebook device ID' })
  device_fb_id?: string;

  @ApiProperty({ example: '2023-08-21T10:30:00Z', description: 'Last login timestamp' })
  logged_at: Date;

  @ApiProperty({ example: '2023-08-21T10:00:00Z', description: 'Device first seen' })
  created_at: Date;

  @ApiProperty({ example: '2023-08-21T10:30:00Z', description: 'Last device update' })
  updated_at: Date;
}

export class DeviceListResponseDto {
  @ApiProperty({ type: [DeviceResponseDto], description: 'List of user devices' })
  devices: DeviceResponseDto[];

  @ApiProperty({ example: 3, description: 'Total number of devices' })
  total: number;
}

export class ParsedUserAgentDto {
  @ApiProperty({ example: 'iOS', description: 'Operating system' })
  os?: string;

  @ApiProperty({ example: '16.5.1', description: 'OS version' })
  osVersion?: string;

  @ApiProperty({ example: 'Safari', description: 'Browser name' })
  browser?: string;

  @ApiProperty({ example: '605.1.15', description: 'Browser version' })
  browserVersion?: string;

  @ApiProperty({ example: 'iPhone', description: 'Device type' })
  device?: string;

  @ApiProperty({ example: 'Mobile', description: 'Device category' })
  deviceType?: string;
}

export class GeolocationResponseDto {
  @ApiProperty({ example: '192.168.1.100', description: 'IP address' })
  ip: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  city?: string;

  @ApiProperty({ example: 'NY', description: 'Region/State code' })
  region?: string;

  @ApiProperty({ example: 'United States', description: 'Country name' })
  country?: string;

  @ApiProperty({ example: 'US', description: 'Country code' })
  countryCode?: string;

  @ApiProperty({ example: 'Verizon Communications', description: 'Internet Service Provider' })
  isp?: string;

  @ApiProperty({ example: 'America/New_York', description: 'Timezone' })
  timezone?: string;

  @ApiProperty({ example: 40.7128, description: 'Latitude coordinate' })
  lat?: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude coordinate' })
  lon?: number;
}