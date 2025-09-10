import { UsersService } from '../services/users.service';
import { BalanceService } from '../services/balance.service';
import { RpBalanceService } from '../services/rp-balance.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { UpdateScratchCardsDto } from '../dto/update-scratch-cards.dto';
import { MobileUserProfileDto } from '../dto/mobile-user-profile.dto';
import { ModifyBalanceDto } from '../dto/balance-change.dto';
import { ModifyRpBalanceDto, RpBalanceChangeResponseDto, RpBalanceTransactionHistoryResponseDto } from '../dto/rp-balance.dto';
import { BalanceResponseDto, BalanceChangeResponseDto, TransactionHistoryResponseDto, TransactionHistoryDto } from '../dto/balance-response.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';
export declare class UsersController {
    private readonly usersService;
    private readonly balanceService;
    private readonly rpBalanceService;
    constructor(usersService: UsersService, balanceService: BalanceService, rpBalanceService: RpBalanceService);
    getProfile(user: AuthenticatedUser): Promise<MobileUserProfileDto>;
    updateProfile(user: AuthenticatedUser, updateProfileDto: UpdateProfileDto): Promise<MobileUserProfileDto>;
    getBalance(user: AuthenticatedUser): Promise<BalanceResponseDto>;
    modifyBalance(user: AuthenticatedUser, modifyBalanceDto: ModifyBalanceDto): Promise<BalanceChangeResponseDto>;
    getTransactionHistory(user: AuthenticatedUser, page?: number, limit?: number): Promise<TransactionHistoryResponseDto>;
    getTransactionById(user: AuthenticatedUser, transactionId: number): Promise<TransactionHistoryDto>;
    updateLevel(user: AuthenticatedUser, updateLevelDto: UpdateLevelDto): Promise<MobileUserProfileDto>;
    updateScratchCards(user: AuthenticatedUser, updateScratchCardsDto: UpdateScratchCardsDto): Promise<MobileUserProfileDto>;
    modifyRpBalance(user: AuthenticatedUser, modifyRpBalanceDto: ModifyRpBalanceDto): Promise<RpBalanceChangeResponseDto>;
    getRpTransactionHistory(user: AuthenticatedUser, page?: number, limit?: number): Promise<RpBalanceTransactionHistoryResponseDto>;
}
