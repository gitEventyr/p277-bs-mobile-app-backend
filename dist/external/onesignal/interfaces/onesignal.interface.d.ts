export interface OneSignalNotificationRequest {
    app_id: string;
    template_id: string;
    include_aliases: {
        external_id: string[];
    };
    target_channel: 'email' | 'sms';
    custom_data?: Record<string, any>;
}
export interface OneSignalNotificationResponse {
    id: string;
    recipients: number;
    external_id?: string;
}
export interface OneSignalErrorResponse {
    errors: string[];
}
export interface OneSignalConfig {
    appId: string;
    apiKey: string;
}
