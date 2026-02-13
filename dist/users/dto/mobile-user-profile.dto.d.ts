export declare class RegistrationOfferDto {
    logo_url: string;
    id: number;
    public_name: string;
    offer_preheading: string;
    offer_heading: string;
    offer_subheading: string;
    terms_and_conditions: string;
    offer_link: string;
    is_active: boolean;
}
export declare class DepositConfirmedDto {
    public_name: string;
    action_date: Date;
    rp_value: number;
}
export declare class MobileUserProfileDto {
    id: number;
    visitor_id: string;
    name?: string;
    email?: string;
    phone?: string;
    coins_balance: number;
    rp_balance: number;
    level: number;
    experience: number;
    scratch_cards: number;
    email_verified: boolean;
    email_verified_at?: Date;
    phone_verified: boolean;
    phone_verified_at?: Date;
    age_verified: boolean;
    daily_spin_wheel_day_count: number;
    daily_spin_wheel_last_spin?: Date;
    lucky_wheel_count: number;
    daily_coins_days_count: number;
    daily_coins_last_reward?: Date;
    registration_offers: RegistrationOfferDto[];
    deposit_confirmed: DepositConfirmedDto[];
}
