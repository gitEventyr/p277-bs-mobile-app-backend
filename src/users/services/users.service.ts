import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Player } from '../../entities/player.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { MobileUserProfileDto } from '../dto/mobile-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async getProfile(userId: number): Promise<UserProfileDto> {
    const player = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
    });

    if (!player) {
      throw new NotFoundException('User not found');
    }

    // Return all user fields including AppsFlyer attribution data
    const profile: UserProfileDto = {
      id: player.id,
      visitor_id: player.visitor_id,
      name: player.name,
      email: player.email,
      phone: player.phone,
      coins_balance: player.coins_balance,
      rp_balance: player.rp_balance,
      level: player.level,
      scratch_cards: player.scratch_cards,
      device_udid: player.device_udid,
      subscription_agreement: player.subscription_agreement,
      tnc_agreement: player.tnc_agreement,
      os: player.os,
      device: player.device,
      created_at: player.created_at,
      updated_at: player.updated_at,
      // AppsFlyer attribution data
      pid: player.pid,
      c: player.c,
      af_channel: player.af_channel,
      af_adset: player.af_adset,
      af_ad: player.af_ad,
      af_keywords: player.af_keywords,
      is_retargeting: player.is_retargeting,
      af_click_lookback: player.af_click_lookback,
      af_viewthrough_lookback: player.af_viewthrough_lookback,
      af_sub1: player.af_sub1,
      af_sub2: player.af_sub2,
      af_sub3: player.af_sub3,
      af_sub4: player.af_sub4,
      af_sub5: player.af_sub5,
    };

    return profile;
  }

  async getMobileProfile(userId: number): Promise<MobileUserProfileDto> {
    const fullProfile = await this.getProfile(userId);

    // Convert full profile to mobile profile (excluding specific fields)
    const mobileProfile: MobileUserProfileDto = {
      id: fullProfile.id,
      visitor_id: fullProfile.visitor_id,
      name: fullProfile.name,
      email: fullProfile.email,
      phone: fullProfile.phone,
      coins_balance: fullProfile.coins_balance,
      rp_balance: fullProfile.rp_balance,
      level: fullProfile.level,
      scratch_cards: fullProfile.scratch_cards,
    };

    return mobileProfile;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const player = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
    });

    if (!player) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateProfileDto.email && updateProfileDto.email !== player.email) {
      const existingPlayer = await this.playerRepository.findOne({
        where: { email: updateProfileDto.email, is_deleted: false },
      });

      if (existingPlayer) {
        throw new BadRequestException('Email is already in use');
      }
    }

    // Update only the fields that are provided
    if (updateProfileDto.name !== undefined) {
      player.name = updateProfileDto.name;
    }
    if (updateProfileDto.email !== undefined) {
      player.email = updateProfileDto.email;
    }
    if (updateProfileDto.phone !== undefined) {
      player.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.deviceUDID !== undefined) {
      player.device_udid = updateProfileDto.deviceUDID;
    }
    if (updateProfileDto.os !== undefined) {
      player.os = updateProfileDto.os;
    }
    if (updateProfileDto.device !== undefined) {
      player.device = updateProfileDto.device;
    }
    if (updateProfileDto.level !== undefined) {
      player.level = updateProfileDto.level;
    }
    if (updateProfileDto.scratch_cards !== undefined) {
      player.scratch_cards = updateProfileDto.scratch_cards;
    }

    // Save the updated player
    const updatedPlayer = await this.playerRepository.save(player);

    // Return the updated profile
    return this.getProfile(updatedPlayer.id);
  }

  async findById(userId: number): Promise<Player | null> {
    return await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
    });
  }

  // Admin dashboard methods
  async getTotalUsersCount(): Promise<number> {
    return await this.playerRepository.count({ where: { is_deleted: false } });
  }

  async getActiveUsersCount(): Promise<number> {
    // Assuming active users are those who updated within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.playerRepository
      .createQueryBuilder('player')
      .where('player.is_deleted = false')
      .andWhere('player.updated_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();
  }

  async getTotalBalance(): Promise<number> {
    const result = await this.playerRepository
      .createQueryBuilder('player')
      .select('SUM(player.coins_balance)', 'total')
      .where('player.is_deleted = false')
      .getRawOne();

    return parseInt(result?.total || '0');
  }

  async getNewRegistrationsCount(): Promise<number> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    return await this.playerRepository
      .createQueryBuilder('player')
      .where('player.is_deleted = false')
      .andWhere('player.created_at >= :twentyFourHoursAgo', {
        twentyFourHoursAgo,
      })
      .getCount();
  }

  async findUsersForAdmin(options: {
    page: number;
    limit: number;
    search: string;
    status: string;
    sortBy: string;
  }): Promise<{ data: Player[]; total: number }> {
    const { page, limit, search, status, sortBy } = options;
    const skip = (page - 1) * limit;

    let query = this.playerRepository
      .createQueryBuilder('player')
      .where('player.is_deleted = false');

    // Search functionality
    if (search) {
      query = query.andWhere(
        '(player.name ILIKE :search OR player.email ILIKE :search OR player.phone ILIKE :search OR player.visitor_id ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Status filter based on recent activity
    if (status === 'active') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.andWhere('player.updated_at >= :thirtyDaysAgo', {
        thirtyDaysAgo,
      });
    } else if (status === 'inactive') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.andWhere('player.updated_at < :thirtyDaysAgo', {
        thirtyDaysAgo,
      });
    }

    // Sorting
    const sortField =
      sortBy === 'name'
        ? 'player.name'
        : sortBy === 'email'
          ? 'player.email'
          : sortBy === 'coins_balance'
            ? 'player.coins_balance'
            : 'player.created_at';

    query = query.orderBy(sortField, 'DESC');

    // Get total count for pagination
    const total = await query.getCount();

    // Apply pagination
    const data = await query.skip(skip).take(limit).getMany();

    return { data, total };
  }

  async findByEmail(email: string): Promise<Player | null> {
    return await this.playerRepository.findOne({
      where: { email, is_deleted: false },
    });
  }

  async createUser(createData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<UserProfileDto> {
    const { name, email, phone, password } = createData;

    // Generate unique visitor_id
    let visitorId: string;
    let attempts = 0;
    do {
      visitorId = this.generateVisitorId();
      attempts++;
      if (attempts > 10) {
        throw new BadRequestException('Unable to generate unique visitor ID');
      }
    } while (
      await this.playerRepository.findOne({
        where: { visitor_id: visitorId, is_deleted: false },
      })
    );

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create new player with default values
    const player = this.playerRepository.create({
      visitor_id: visitorId,
      name,
      email,
      phone,
      password: hashedPassword,
      coins_balance: 1000, // Starting balance
      level: 1,
      scratch_cards: 0,
    });

    const savedPlayer = await this.playerRepository.save(player);
    return this.getProfile(savedPlayer.id);
  }

  private generateVisitorId(): string {
    return (
      'visitor_' +
      Math.random().toString(36).substr(2, 9) +
      Date.now().toString(36)
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
}
