import { Repository } from 'typeorm';
import { CasinoAction } from '../../entities/casino-action.entity';
import { Casino } from '../../entities/casino.entity';
import { Player } from '../../entities/player.entity';
import { CasinoApiService } from '../../external/casino/casino-api.service';
import { RpBalanceService } from '../../users/services/rp-balance.service';
export declare class CasinoActionService {
    private casinoActionRepository;
    private casinoRepository;
    private playerRepository;
    private readonly casinoApiService;
    private readonly rpBalanceService;
    private readonly logger;
    constructor(casinoActionRepository: Repository<CasinoAction>, casinoRepository: Repository<Casino>, playerRepository: Repository<Player>, casinoApiService: CasinoApiService, rpBalanceService: RpBalanceService);
    findAll(options: {
        page: number;
        limit: number;
        search: string;
        casinoName?: string | null;
        registration?: string;
        deposit?: string;
        sortBy: string;
    }): Promise<{
        data: {
            visitor_id: string;
            player: any;
            is_user_deleted: boolean;
            id: number;
            casino_name: string;
            date_of_action: Date;
            registration: boolean;
            deposit: boolean;
            created_at: Date;
            updated_at: Date;
            casino?: any;
        }[];
        pagination: {
            total: number;
            from: number;
            to: number;
            currentPage: number;
            totalPages: number;
            hasPages: boolean;
            hasPrev: boolean;
            hasNext: boolean;
            prevPage: number;
            nextPage: number;
            pages: {
                number: number;
                active: boolean;
            }[];
        };
    }>;
    findById(id: number): Promise<any>;
    create(createData: {
        casino_name: string;
        date_of_action: Date;
        visitor_id: string;
        registration: boolean;
        deposit: boolean;
    }): Promise<CasinoAction>;
    private processRpRewards;
    private processRegistrationReward;
    private processDepositReward;
    update(id: number, updateData: Partial<{
        casino_name: string;
        date_of_action: Date;
        visitor_id: string;
        registration: boolean;
        deposit: boolean;
    }>): Promise<CasinoAction>;
    delete(id: number): Promise<void>;
    count(): Promise<number>;
    countByCasino(casinoName: string): Promise<number>;
    countByType(type: 'registration' | 'deposit'): Promise<number>;
    bulkCreateFromCSV(csvContent: string, options: {
        skipErrors?: boolean;
        createMissingCasinos?: boolean;
        createMissingPlayers?: boolean;
    }): Promise<{
        totalRows: number;
        successfulRows: number;
        errorRows: number;
        skippedRows: number;
        errors: Array<{
            row: number;
            message: string;
        }>;
        createdCasinos: number;
        createdPlayers: number;
    }>;
    private parseCSVRow;
    private validateAndParseCSVRow;
    private parseBoolean;
}
