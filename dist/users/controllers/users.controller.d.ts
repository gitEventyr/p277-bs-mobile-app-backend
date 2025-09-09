import { UsersService } from '../services/users.service';
import { BalanceService } from '../services/balance.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { ModifyBalanceDto } from '../dto/balance-change.dto';
import { BalanceResponseDto, BalanceChangeResponseDto, TransactionHistoryResponseDto, TransactionHistoryDto } from '../dto/balance-response.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';
export declare class UsersController {
    private readonly usersService;
    private readonly balanceService;
    constructor(usersService: UsersService, balanceService: BalanceService);
    getProfile(user: AuthenticatedUser): Promise<UserProfileDto>;
    updateProfile(user: AuthenticatedUser, updateProfileDto: UpdateProfileDto): Promise<UserProfileDto>;
    getBalance(user: AuthenticatedUser): Promise<BalanceResponseDto>;
    modifyBalance(user: AuthenticatedUser, modifyBalanceDto: ModifyBalanceDto): Promise<BalanceChangeResponseDto>;
    getTransactionHistory(user: AuthenticatedUser, page?: number, limit?: number): Promise<TransactionHistoryResponseDto>;
    getTransactionById(user: AuthenticatedUser, transactionId: number): Promise<TransactionHistoryDto>;
}
