import { GeolocationResponseDto } from '../../devices/dto/device-response.dto';
export declare class GeolocationService {
    private readonly logger;
    getLocationFromIp(ip: string): Promise<GeolocationResponseDto>;
    private isLocalIp;
    enrichLocationData(location: GeolocationResponseDto): Promise<GeolocationResponseDto>;
}
