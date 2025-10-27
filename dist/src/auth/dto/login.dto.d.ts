export declare class LoginDto {
    email: string;
    password: string;
    deviceUDID: string;
}
export declare class LoginResponseDto {
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
        daily_spin_wheel_day_count: number;
        daily_spin_wheel_last_spin?: Date;
        lucky_wheel_count: number;
        daily_coins_days_count: number;
        daily_coins_last_reward?: Date;
    };
}
