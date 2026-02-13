export interface OneSignalNotificationRequest {
    app_id: string;
    template_id: string;
    include_aliases?: {
        external_id: string[];
    };
    include_email_tokens?: string[];
    include_phone_numbers?: string[];
    target_channel: 'email' | 'sms';
    custom_data?: Record<string, any>;
    email_subject?: string;
    contents?: {
        en: string;
    };
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
export interface OneSignalSubscription {
    id: string;
    type: string;
    token: string;
    enabled: boolean;
    notification_types?: number;
}
export interface OneSignalUserResponse {
    properties: {
        tags?: Record<string, string>;
        language?: string;
        timezone_id?: string;
        lat?: number;
        long?: number;
        country?: string;
        first_active?: number;
        last_active?: number;
    };
    identity: {
        external_id?: string;
        onesignal_id?: string;
    };
    subscriptions: OneSignalSubscription[];
}
