import type { Response } from 'express';
import * as session from 'express-session';
import { CasinoActionService } from '../services/casino-action.service';
import { CasinoService } from '../services/casino.service';
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
export declare class CasinoActionController {
    private readonly casinoActionService;
    private readonly casinoService;
    private readonly casinoApiService;
    constructor(casinoActionService: CasinoActionService, casinoService: CasinoService, casinoApiService: CasinoApiService);
    casinoActions(session: AdminSession, query: any, res: Response): Promise<void>;
    getCasinoActionDetails(id: string, session: AdminSession): Promise<import("../../entities/casino-action.entity").CasinoAction>;
    createCasinoAction(createData: {
        casino_name: string;
        date_of_action: string;
        visitor_id: string;
        registration: boolean;
        deposit: boolean;
    }, session: AdminSession): Promise<import("../../entities/casino-action.entity").CasinoAction>;
    updateCasinoAction(id: string, updateData: {
        casino_name?: string;
        date_of_action?: string;
        visitor_id?: string;
        registration?: boolean;
        deposit?: boolean;
    }, session: AdminSession): Promise<import("../../entities/casino-action.entity").CasinoAction>;
    deleteCasinoAction(id: string, session: AdminSession): Promise<{
        success: boolean;
        message: string;
    }>;
    bulkUploadCSV(file: any, body: any, session: AdminSession): Promise<{
        success: boolean;
        message: string;
        summary: {
            totalRows: number;
            successfulRows: number;
            errorRows: number;
            skippedRows: number;
            errors: {
                row: number;
                message: string;
            }[];
            createdCasinos: number;
            createdPlayers: number;
        };
        autoSyncResults: {
            syncedCount: number;
            totalInternalCasinos: number;
            externalCasinosAvailable: number;
        } | null;
        errors: {
            row: number;
            message: string;
        }[];
    }>;
    private buildQueryString;
}
export {};
