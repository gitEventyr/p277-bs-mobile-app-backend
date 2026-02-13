import type { Response } from 'express';
import * as session from 'express-session';
import { CasinoService } from '../services/casino.service';
import { CreateCasinoDto } from '../dto/create-casino.dto';
import { UpdateCasinoDto } from '../dto/update-casino.dto';
import { CasinoApiService } from '../../external/casino/casino-api.service';
interface AdminSession extends session.Session {
    admin?: {
        id: string;
        email: string;
        display_name: string;
        token: string;
    };
    flashMessage?: string;
    flashType?: 'success' | 'error' | 'warning' | 'info';
}
export declare class CasinoController {
    private readonly casinoService;
    private readonly casinoApiService;
    constructor(casinoService: CasinoService, casinoApiService: CasinoApiService);
    casinos(session: AdminSession, query: any, res: Response): Promise<void>;
    getCasinoDetails(id: string, session: AdminSession): Promise<import("../../entities/casino.entity").Casino>;
    createCasino(createData: CreateCasinoDto, session: AdminSession): Promise<import("../../entities/casino.entity").Casino>;
    updateCasino(id: string, updateData: UpdateCasinoDto, session: AdminSession): Promise<import("../../entities/casino.entity").Casino>;
    deleteCasino(id: string, session: AdminSession): Promise<{
        success: boolean;
        message: string;
    }>;
    syncCasinos(session: AdminSession): Promise<{
        success: boolean;
        message: string;
        syncedCount: number;
        addedCount: number;
        totalCasinos: number;
        externalCasinosFound: number;
        results: {
            casinoName: string;
            matched: boolean;
            externalId?: number;
        }[];
    }>;
    private validateExternalCasinos;
    private buildQueryString;
}
export {};
