import type { Response } from 'express';
import * as session from 'express-session';
import { AdminService } from '../services/admin.service';
import { AnalyticsService } from '../services/analytics.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { UsersService } from '../../users/services/users.service';
import { BalanceService } from '../../users/services/balance.service';
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
export declare class AdminDashboardController {
    private readonly adminService;
    private readonly usersService;
    private readonly analyticsService;
    private readonly balanceService;
    constructor(adminService: AdminService, usersService: UsersService, analyticsService: AnalyticsService, balanceService: BalanceService);
    loginPage(session: AdminSession, query: any): {
        redirect: string;
        title?: undefined;
        error?: undefined;
        email?: undefined;
    } | {
        title: string;
        error: string | null;
        email: any;
        redirect?: undefined;
    };
    loginForm(loginDto: AdminLoginDto, session: AdminSession, res: Response): Promise<void>;
    logout(session: AdminSession, res: Response): void;
    dashboard(session: AdminSession, res: Response): Promise<void>;
    users(session: AdminSession, query: any, res: Response): Promise<void>;
    getUserDetails(id: string, session: AdminSession): Promise<import("../../users/dto/user-profile.dto").UserProfileDto>;
    updateUser(id: string, updateData: Record<string, any>, session: AdminSession): Promise<import("../../users/dto/user-profile.dto").UserProfileDto>;
    adjustBalance(id: string, adjustData: {
        amount: number;
        reason: string;
    }, session: AdminSession): Promise<{
        balance_before: number;
        balance_after: number;
        amount: number;
        mode: string;
        transaction_id: number;
    }>;
    createUser(createData: {
        name: string;
        email: string;
        phone?: string;
        password: string;
    }, session: AdminSession): Promise<import("../../users/dto/user-profile.dto").UserProfileDto>;
    private getDashboardStats;
    private getRecentActivity;
    private getUsersList;
    private buildPagination;
    private buildQueryString;
}
export {};
