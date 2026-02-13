import { Player } from './player.entity';
export declare class RpBalanceTransaction {
    id: number;
    user_id: number;
    balance_before: number;
    balance_after: number;
    amount: number;
    mode: string;
    reason?: string;
    admin_id?: string;
    created_at: Date;
    user: Player;
}
