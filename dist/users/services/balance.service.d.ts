import { Repository, DataSource } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';
import { BalanceChangeDto, ModifyBalanceDto } from '../dto/balance-change.dto';
export declare class BalanceService {
    private readonly playerRepository;
    private readonly balanceChangeRepository;
    private readonly dataSource;
    constructor(playerRepository: Repository<Player>, balanceChangeRepository: Repository<CoinsBalanceChange>, dataSource: DataSource);
    getBalance(userId: number): Promise<{
        coins_balance: number;
        rp_balance: number;
        scratch_cards: number;
    }>;
    increaseBalance(userId: number, balanceChangeDto: BalanceChangeDto): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
    decreaseBalance(userId: number, balanceChangeDto: BalanceChangeDto): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
    modifyBalance(userId: number, modifyBalanceDto: ModifyBalanceDto): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
    private updateBalance;
    getTransactionHistory(userId: number, page?: number, limit?: number): Promise<{
        data: CoinsBalanceChange[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getTransactionById(userId: number, transactionId: number): Promise<CoinsBalanceChange>;
    adminAdjustBalance(userId: number, amount: number, reason: string): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
}
