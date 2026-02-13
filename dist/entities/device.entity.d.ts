export declare class Device {
    id: number;
    user_id: number;
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
    user: any;
}
