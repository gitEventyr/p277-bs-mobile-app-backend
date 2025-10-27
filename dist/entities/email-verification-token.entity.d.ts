import { Player } from './player.entity';
export declare class EmailVerificationToken {
    id: string;
    token: string;
    user_id: number;
    expires_at: Date;
    used: boolean;
    created_at: Date;
    user: Player;
}
