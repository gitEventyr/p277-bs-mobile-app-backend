import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DevicesService } from '../services/devices.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MobileExceptionFilter } from '../../common/filters/mobile-exception.filter';
import {
  DeviceResponseDto,
  DeviceListResponseDto,
} from '../dto/device-response.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@ApiTags('📱 Mobile: Devices')
@Controller('devices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@UseFilters(MobileExceptionFilter)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @ApiOperation({ summary: 'Get all user devices' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User devices retrieved successfully',
    type: DeviceListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Get()
  async getUserDevices(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeviceListResponseDto> {
    return await this.devicesService.getUserDevices(user.id);
  }

  @ApiOperation({ summary: 'Get specific device information' })
  @ApiParam({
    name: 'id',
    description: 'Device ID',
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Device information retrieved successfully',
    type: DeviceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Device not found',
  })
  @Get(':id')
  async getDeviceById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) deviceId: number,
  ): Promise<DeviceResponseDto> {
    return await this.devicesService.getDeviceById(user.id, deviceId);
  }

  @ApiOperation({ summary: 'Get device usage statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Device statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalDevices: { type: 'number', example: 3 },
        operatingSystems: {
          type: 'object',
          example: { iOS: 2, Android: 1 },
        },
        browsers: {
          type: 'object',
          example: { Safari: 2, Chrome: 1 },
        },
        countries: {
          type: 'object',
          example: { 'United States': 2, Canada: 1 },
        },
        lastSeen: { type: 'number', example: 1692616800000 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Get('stats/summary')
  async getDeviceStats(@CurrentUser() user: AuthenticatedUser) {
    return await this.devicesService.getDeviceStats(user.id);
  }
}
