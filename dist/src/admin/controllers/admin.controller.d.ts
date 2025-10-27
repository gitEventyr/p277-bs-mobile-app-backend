import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import type { AuthenticatedAdmin } from '../../common/types/auth.types';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    login(loginDto: AdminLoginDto): Promise<{
        access_token: string;
        token_type: string;
        expires_in: string;
        admin: AuthenticatedAdmin;
    }>;
    getProfile(admin: AuthenticatedAdmin): Promise<{
        id: string;
        email: string;
        display_name: string;
        is_active: boolean;
    }>;
    adminOnly(admin: AuthenticatedAdmin): Promise<{
        message: string;
        admin: {
            id: string;
            email: string;
            display_name: string;
        };
    }>;
}
