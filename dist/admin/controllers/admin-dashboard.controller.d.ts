import type { Response } from 'express';
import * as session from 'express-session';
import { DataSource } from 'typeorm';
import { AdminService } from '../services/admin.service';
import { AnalyticsService } from '../services/analytics.service';
import { VoucherService } from '../services/voucher.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { UsersService } from '../../users/services/users.service';
import { BalanceService } from '../../users/services/balance.service';
import { RpBalanceService } from '../../users/services/rp-balance.service';
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
    private readonly rpBalanceService;
    private readonly voucherService;
    private readonly dataSource;
    constructor(adminService: AdminService, usersService: UsersService, analyticsService: AnalyticsService, balanceService: BalanceService, rpBalanceService: RpBalanceService, voucherService: VoucherService, dataSource: DataSource);
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
    getUserDetails(id: string, session: AdminSession): Promise<{
        ip_address: any;
        location: {
            city: any;
            country: any;
            isp: any;
            timezone: any;
        } | null;
        purchases: {
            total_spent: number;
            total_count: number;
            recent: {
                id: any;
                platform: any;
                product_id: any;
                transaction_id: any;
                amount: any;
                currency: any;
                purchased_at: any;
                created_at: any;
            }[];
        };
        id: number;
        visitor_id: string;
        name?: string;
        email?: string;
        phone?: string;
        coins_balance: number;
        rp_balance: number;
        level: number;
        experience: number;
        scratch_cards: number;
        device_udid?: string;
        subscription_agreement?: boolean;
        tnc_agreement?: boolean;
        os?: string;
        device?: string;
        created_at: Date;
        updated_at: Date;
        pid?: string;
        c?: string;
        af_channel?: string;
        af_adset?: string;
        af_ad?: string;
        af_keywords?: string[];
        is_retargeting?: boolean;
        af_click_lookback?: number;
        af_viewthrough_lookback?: number;
        af_sub1?: string;
        af_sub2?: string;
        af_sub3?: string;
        af_sub4?: string;
        af_sub5?: string;
        email_verified: boolean;
        email_verified_at?: Date;
        phone_verified: boolean;
        phone_verified_at?: Date;
    }>;
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
    adjustRpBalance(id: string, adjustData: {
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
    deleteUser(id: string, session: AdminSession): Promise<{
        message: string;
    }>;
    private getDashboardStats;
    private getRecentActivity;
    private getUsersList;
    private buildPagination;
    private buildQueryString;
    vouchers(session: AdminSession, res: Response): Promise<void>;
    voucherRequests(session: AdminSession, query: any, res: Response): Promise<void>;
}
export {};
