export declare class DeviceResponseDto {
    id: number;
    udid: string;
    os_type?: string;
    os_version?: string;
    browser?: string;
    ip?: string;
    city?: string;
    country?: string;
    isp?: string;
    timezone?: string;
    device_fb_id?: string;
    logged_at: Date;
    created_at: Date;
    updated_at: Date;
}
export declare class DeviceListResponseDto {
    devices: DeviceResponseDto[];
    total: number;
}
export declare class ParsedUserAgentDto {
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    device?: string;
    deviceType?: string;
}
export declare class GeolocationResponseDto {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    isp?: string;
    timezone?: string;
    lat?: number;
    lon?: number;
}
