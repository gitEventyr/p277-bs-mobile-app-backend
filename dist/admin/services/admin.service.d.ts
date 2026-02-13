import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from '../../entities/admin-user.entity';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AuthenticatedAdmin } from '../../common/types/auth.types';
export declare class AdminService {
    private adminRepository;
    private jwtService;
    constructor(adminRepository: Repository<AdminUser>, jwtService: JwtService);
    login(loginDto: AdminLoginDto): Promise<{
        access_token: string;
        token_type: string;
        expires_in: string;
        admin: AuthenticatedAdmin;
    }>;
    findById(id: string): Promise<AdminUser>;
    findByEmail(email: string): Promise<AdminUser | null>;
}
