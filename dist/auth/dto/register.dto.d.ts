export declare class AppsFlyerDto {
    pid?: string;
    c?: string;
    af_channel?: string;
    af_adset?: string;
    af_ad?: string;
    af_keywords?: string;
    is_retargeting?: boolean;
    af_click_lookback?: number;
    af_viewthrough_lookback?: number;
    af_sub1?: string;
    af_sub2?: string;
    af_sub3?: string;
    af_sub4?: string;
    af_sub5?: string;
}
export declare class RegisterDto {
    email?: string;
    name?: string;
    phone?: string;
    password?: string;
    deviceUDID?: string;
    subscription_agreement?: boolean;
    tnc_agreement?: boolean;
    os?: string;
    device?: string;
    appsflyer?: AppsFlyerDto;
}
export declare class RegisterResponseDto {
    access_token: string;
    token_type: string;
    expires_in: string;
    user: {
        id: number;
        visitor_id: string;
        email?: string;
        name?: string;
        coins_balance: number;
        rp_balance: number;
        level: number;
        experience: number;
        scratch_cards: number;
        ipaddress: string;
        avatar?: string;
        email_verified: boolean;
        phone_verified: boolean;
        age_verified: boolean;
        daily_spin_wheel_day_count: number;
        daily_spin_wheel_last_spin?: Date;
        lucky_wheel_count: number;
        daily_coins_days_count: number;
        daily_coins_last_reward?: Date;
    };
}
