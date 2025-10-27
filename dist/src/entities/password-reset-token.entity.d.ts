import { Player } from './player.entity';
export declare class PasswordResetToken {
    id: string;
    token: string;
    user_id: number;
    user: Player;
    expires_at: Date;
    used: boolean;
    created_at: Date;
}
