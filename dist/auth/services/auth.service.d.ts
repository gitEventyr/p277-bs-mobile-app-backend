import { JwtService } from '@nestjs/jwt';
import { Repository, DataSource } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { AdminUser } from '../../entities/admin-user.entity';
import { CasinoAction } from '../../entities/casino-action.entity';
import { JwtPayload, AuthenticatedUser, AuthenticatedAdmin, SessionUser } from '../../common/types/auth.types';
export declare class AuthService {
    private readonly playerRepository;
    private readonly adminRepository;
    private readonly casinoActionRepository;
    private readonly jwtService;
    private readonly dataSource;
    constructor(playerRepository: Repository<Player>, adminRepository: Repository<AdminUser>, casinoActionRepository: Repository<CasinoAction>, jwtService: JwtService, dataSource: DataSource);
    generateJwtToken(payload: JwtPayload): Promise<string>;
    verifyJwtToken(token: string): Promise<JwtPayload>;
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    generateResetToken(): string;
    generateResetCode(): string;
    validateUser(payload: JwtPayload): Promise<AuthenticatedUser | AuthenticatedAdmin | null>;
    validatePlayer(playerId: number): Promise<AuthenticatedUser | null>;
    validateAdmin(adminId: string): Promise<AuthenticatedAdmin | null>;
    createSessionUser(user: AuthenticatedUser | AuthenticatedAdmin, type: 'user' | 'admin'): SessionUser;
    softDeleteAccount(userId: number): Promise<void>;
    logout(): Promise<void>;
}
