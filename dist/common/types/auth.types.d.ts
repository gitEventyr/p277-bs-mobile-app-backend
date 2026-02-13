export interface JwtPayload {
    sub: number | string;
    email: string;
    type: 'user' | 'admin';
    token_version?: number;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedUser {
    id: number;
    email?: string;
    name?: string;
    visitor_id: string;
    coins_balance: number;
    level: number;
    scratch_cards: number;
    avatar?: string;
}
export interface AuthenticatedAdmin {
    id: string;
    email: string;
    display_name: string;
    is_active: boolean;
}
export interface SessionUser {
    userId: number;
    email?: string;
    type: 'user' | 'admin';
}
