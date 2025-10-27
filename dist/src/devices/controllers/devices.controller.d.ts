import { DevicesService } from '../services/devices.service';
import { DeviceResponseDto, DeviceListResponseDto } from '../dto/device-response.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    getUserDevices(user: AuthenticatedUser): Promise<DeviceListResponseDto>;
    getDeviceById(user: AuthenticatedUser, deviceId: number): Promise<DeviceResponseDto>;
    getDeviceStats(user: AuthenticatedUser): Promise<{
        totalDevices: number;
        operatingSystems: {};
        browsers: {};
        countries: {};
        lastSeen: number | null;
    }>;
}
