import { Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { MobileUserProfileDto } from '../dto/mobile-user-profile.dto';
export declare class UsersService {
    private readonly playerRepository;
    constructor(playerRepository: Repository<Player>);
    getProfile(userId: number): Promise<UserProfileDto>;
    getMobileProfile(userId: number): Promise<MobileUserProfileDto>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<UserProfileDto>;
    findById(userId: number): Promise<Player | null>;
    getTotalUsersCount(): Promise<number>;
    getActiveUsersCount(): Promise<number>;
    getTotalBalance(): Promise<number>;
    getNewRegistrationsCount(): Promise<number>;
    findUsersForAdmin(options: {
        page: number;
        limit: number;
        search: string;
        status: string;
        sortBy: string;
    }): Promise<{
        data: Player[];
        total: number;
    }>;
    findByEmail(email: string): Promise<Player | null>;
    createUser(createData: {
        name: string;
        email: string;
        phone?: string;
        password: string;
    }): Promise<UserProfileDto>;
    private generateVisitorId;
    private hashPassword;
}
