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
    scratch_cards: number;
    email_verified: boolean;
    email_verified_at?: Date;
    phone_verified: boolean;
    phone_verified_at?: Date;
    registration_offers: RegistrationOfferDto[];
    deposit_confirmed: DepositConfirmedDto[];
}
