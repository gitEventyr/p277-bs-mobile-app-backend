import { Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';
import { GeolocationService } from '../../external/geolocation/geolocation.service';
import { DeviceResponseDto, DeviceListResponseDto, ParsedUserAgentDto } from '../dto/device-response.dto';
export declare class DevicesService {
    private readonly deviceRepository;
    private readonly geolocationService;
    private readonly logger;
    constructor(deviceRepository: Repository<Device>, geolocationService: GeolocationService);
    getUserDevices(userId: number): Promise<DeviceListResponseDto>;
    getDeviceById(userId: number, deviceId: number): Promise<DeviceResponseDto>;
    createOrUpdateDevice(userId: number, udid: string, userAgent: string, ip: string): Promise<Device>;
    parseUserAgent(userAgent: string): ParsedUserAgentDto;
    private formatBrowserString;
    private mapToDeviceResponse;
    getDeviceStats(userId: number): Promise<{
        totalDevices: number;
        operatingSystems: {};
        browsers: {};
        countries: {};
        lastSeen: number | null;
    }>;
}
