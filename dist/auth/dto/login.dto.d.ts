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
        scratch_cards: number;
        ipaddress: string;
        avatar?: string;
    };
}
