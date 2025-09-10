import { Repository, DataSource } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { RpBalanceTransaction } from '../../entities/rp-balance-transaction.entity';
import { ModifyRpBalanceDto } from '../dto/rp-balance.dto';
export declare class RpBalanceService {
    private readonly playerRepository;
    private readonly rpTransactionRepository;
    private readonly dataSource;
    constructor(playerRepository: Repository<Player>, rpTransactionRepository: Repository<RpBalanceTransaction>, dataSource: DataSource);
    modifyRpBalance(userId: number, modifyRpBalanceDto: ModifyRpBalanceDto, adminId?: string): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
    adminAdjustRpBalance(userId: number, amount: number, reason: string, adminId: string): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
    private updateRpBalance;
    getRpTransactionHistory(userId: number, page?: number, limit?: number): Promise<{
        data: RpBalanceTransaction[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getRpTransactionById(userId: number, transactionId: number): Promise<RpBalanceTransaction>;
    private determineMode;
    getRpBalance(userId: number): Promise<{
        rp_balance: number;
    }>;
}
