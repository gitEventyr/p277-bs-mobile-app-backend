import { Repository } from 'typeorm';
import { Casino } from '../../entities/casino.entity';
export declare class CasinoService {
    private casinoRepository;
    constructor(casinoRepository: Repository<Casino>);
    findAll(options: {
        page: number;
        limit: number;
        search: string;
        sortBy: string;
    }): Promise<{
        data: Casino[];
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
    findById(id: number): Promise<Casino | null>;
    findByName(casino_name: string): Promise<Casino | null>;
    findByCasinoId(casino_id: string): Promise<Casino | null>;
    create(createData: {
        casino_name: string;
        casino_id?: string;
    }): Promise<Casino>;
    update(id: number, updateData: {
        casino_name: string;
        casino_id?: string;
    }): Promise<Casino>;
    delete(id: number): Promise<void>;
    count(): Promise<number>;
    findAllForSync(): Promise<Casino[]>;
    updateCasinoId(id: number, casino_id: string): Promise<void>;
}
