import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Player } from '../../entities/player.entity';
import { CasinoAction } from '../../entities/casino-action.entity';
import { Casino } from '../../entities/casino.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import {
  MobileUserProfileDto,
  RegistrationOfferDto,
  DepositConfirmedDto,
} from '../dto/mobile-user-profile.dto';
import { CasinoApiService } from '../../external/casino/casino-api.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(CasinoAction)
    private readonly casinoActionRepository: Repository<CasinoAction>,
    @InjectRepository(Casino)
    private readonly casinoRepository: Repository<Casino>,
    private readonly casinoApiService: CasinoApiService,
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
      experience: player.experience,
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
      // Verification status
      email_verified: player.email_verified,
      email_verified_at: player.email_verified_at,
      phone_verified: player.phone_verified,
      phone_verified_at: player.phone_verified_at,
    };

    return profile;
  }

  async getMobileProfile(userId: number): Promise<MobileUserProfileDto> {
    const fullProfile = await this.getProfile(userId);

    // Get registration offers
    const registrationOffers = await this.getRegistrationOffers(
      fullProfile.visitor_id,
    );

    // Get deposit confirmed data
    const depositConfirmed = await this.getDepositConfirmed(
      fullProfile.visitor_id,
    );

    // Get player from database to access additional fields
    const player = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
    });

    if (!player) {
      throw new NotFoundException('User not found');
    }

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
      experience: fullProfile.experience,
      scratch_cards: fullProfile.scratch_cards,
      // Verification status
      email_verified: fullProfile.email_verified,
      email_verified_at: fullProfile.email_verified_at,
      phone_verified: fullProfile.phone_verified,
      phone_verified_at: fullProfile.phone_verified_at,
      // Daily spin, lucky wheel, and daily coins fields
      daily_spin_wheel_day_count: player.daily_spin_wheel_day_count,
      daily_spin_wheel_last_spin: player.daily_spin_wheel_last_spin,
      lucky_wheel_count: player.lucky_wheel_count,
      daily_coins_days_count: player.daily_coins_days_count,
      daily_coins_last_reward: player.daily_coins_last_reward,
      // New parameters
      registration_offers: registrationOffers,
      deposit_confirmed: depositConfirmed,
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

    // Update only the fields that are provided
    if (updateProfileDto.name !== undefined) {
      player.name = updateProfileDto.name;
    }
    if (updateProfileDto.email !== undefined) {
      // Check if new email is already in use by another non-deleted user
      if (updateProfileDto.email && updateProfileDto.email.trim()) {
        const trimmedEmail = updateProfileDto.email.trim();
        // Only check for duplicates if the email is actually changing
        if (trimmedEmail !== player.email) {
          const existingUser = await this.playerRepository.findOne({
            where: { email: trimmedEmail, is_deleted: false },
          });
          if (existingUser && existingUser.id !== userId) {
            throw new BadRequestException(
              'This email address is already in use',
            );
          }
        }
      }
      player.email = updateProfileDto.email;
    }
    if (updateProfileDto.phone !== undefined) {
      // Check if new phone is already in use by another non-deleted user
      if (updateProfileDto.phone && updateProfileDto.phone.trim()) {
        const trimmedPhone = updateProfileDto.phone.trim();
        // Only check for duplicates if the phone is actually changing
        if (trimmedPhone !== player.phone) {
          const existingUser = await this.playerRepository.findOne({
            where: { phone: trimmedPhone, is_deleted: false },
          });
          if (existingUser && existingUser.id !== userId) {
            throw new BadRequestException(
              'This phone number is already in use',
            );
          }
        }
      }
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
    if (updateProfileDto.experience !== undefined) {
      player.experience = updateProfileDto.experience;
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
    email_verified?: string;
    phone_verified?: string;
  }): Promise<{ data: Player[]; total: number }> {
    const {
      page,
      limit,
      search,
      status,
      sortBy,
      email_verified,
      phone_verified,
    } = options;
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

    // Email verification filter
    if (email_verified === 'true') {
      query = query.andWhere('player.email_verified = true');
    } else if (email_verified === 'false') {
      query = query.andWhere('player.email_verified = false');
    }

    // Phone verification filter
    if (phone_verified === 'true') {
      query = query.andWhere('player.phone_verified = true');
    } else if (phone_verified === 'false') {
      query = query.andWhere('player.phone_verified = false');
    }

    // Sorting
    const sortField =
      sortBy === 'name'
        ? 'player.name'
        : sortBy === 'email'
          ? 'player.email'
          : sortBy === 'coins_balance'
            ? 'player.coins_balance'
            : sortBy === 'rp_balance'
              ? 'player.rp_balance'
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
      coins_balance: 10000, // Starting balance
      rp_balance: 0, // Starting RP balance
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

  private async getRegistrationOffers(
    visitorId: string,
  ): Promise<RegistrationOfferDto[]> {
    try {
      // Step 1: Get casino actions with registration=true but no deposit for this user
      const registeredActions = await this.casinoActionRepository.find({
        where: {
          visitor_id: visitorId,
          registration: true,
        },
        relations: ['casino'],
      });

      // Step 2: Get casino actions with deposit=true for this user
      const depositActions = await this.casinoActionRepository.find({
        where: {
          visitor_id: visitorId,
          deposit: true,
        },
        relations: ['casino'],
      });

      // Step 3: Extract casino names that have deposits
      const depositedCasinoNames = new Set(
        depositActions.map((action) => action.casino_name),
      );

      // Step 4: Filter casinos that have registration but no deposit
      const registeredOnlyCasinos = registeredActions.filter(
        (action) => !depositedCasinoNames.has(action.casino_name),
      );

      // Step 5: Get unique casino_ids for these casinos
      const casinoIds: number[] = [];
      for (const action of registeredOnlyCasinos) {
        const casino = await this.casinoRepository.findOne({
          where: { casino_name: action.casino_name },
        });

        if (casino && casino.casino_id) {
          const casinoIdNumber = parseInt(casino.casino_id);
          if (!isNaN(casinoIdNumber) && !casinoIds.includes(casinoIdNumber)) {
            casinoIds.push(casinoIdNumber);
          }
        }
      }

      // Step 6: If no casino IDs, return empty array
      if (casinoIds.length === 0) {
        return [];
      }

      // Step 7: Call external API for casino details
      const casinoDetails = await this.casinoApiService.getCasinoDetails(
        visitorId,
        casinoIds,
      );

      // Step 8: Convert to RegistrationOfferDto format and filter active offers only
      const registrationOffers: RegistrationOfferDto[] = casinoDetails
        .filter((offer) => offer.is_active === true)
        .map((offer) => ({
          logo_url: offer.logo_url,
          id: offer.id,
          public_name: offer.public_name,
          offer_preheading: offer.offer_preheading,
          offer_heading: offer.offer_heading,
          offer_subheading: offer.offer_subheading,
          terms_and_conditions: offer.terms_and_conditions,
          offer_link: offer.offer_link,
          is_active: offer.is_active,
        }));

      return registrationOffers;
    } catch (error) {
      // Log error and return empty array to not break the profile endpoint
      console.error('Error fetching registration offers:', error);
      return [];
    }
  }

  private async getDepositConfirmed(
    visitorId: string,
  ): Promise<DepositConfirmedDto[]> {
    try {
      // Step 1: Get all unique casinos user has made deposits in
      const depositActions = await this.casinoActionRepository
        .createQueryBuilder('ca')
        .where('ca.visitor_id = :visitorId', { visitorId })
        .andWhere('ca.deposit = true')
        .orderBy('ca.date_of_action', 'ASC')
        .getMany();

      // Step 2: Group by casino_name and get the latest deposit for each
      const casinoDepositsMap = new Map<string, CasinoAction>();
      depositActions.forEach((action) => {
        if (!casinoDepositsMap.has(action.casino_name)) {
          casinoDepositsMap.set(action.casino_name, action);
        } else {
          const existing = casinoDepositsMap.get(action.casino_name)!;
          if (action.date_of_action > existing.date_of_action) {
            casinoDepositsMap.set(action.casino_name, action);
          }
        }
      });

      // Step 3: Extract unique casino_ids for external API call
      const casinoIds: number[] = [];
      const casinoIdToNameMap = new Map<number, string>();

      for (const [casinoName] of casinoDepositsMap) {
        const casino = await this.casinoRepository.findOne({
          where: { casino_name: casinoName },
        });

        if (casino && casino.casino_id) {
          const casinoIdNumber = parseInt(casino.casino_id);
          if (!isNaN(casinoIdNumber)) {
            casinoIds.push(casinoIdNumber);
            casinoIdToNameMap.set(casinoIdNumber, casinoName);
          }
        }
      }

      // Step 4: If no casino IDs, return empty array
      if (casinoIds.length === 0) {
        return [];
      }

      // Step 5: Call external API for casino details
      const casinoDetails = await this.casinoApiService.getCasinoDetails(
        visitorId,
        casinoIds,
      );

      // Step 6: Find the very first deposit of the user across all casinos
      const firstDepositDate = Math.min(
        ...depositActions.map((action) => action.date_of_action.getTime()),
      );

      // Step 7: Create deposit confirmed array
      const depositConfirmed: DepositConfirmedDto[] = [];

      for (const offer of casinoDetails) {
        const casinoName = casinoIdToNameMap.get(offer.id);
        if (casinoName) {
          const depositAction = casinoDepositsMap.get(casinoName);
          if (depositAction) {
            // Check if this is the very first deposit of the user
            const isFirstDeposit =
              depositAction.date_of_action.getTime() === firstDepositDate;

            depositConfirmed.push({
              public_name: offer.public_name,
              action_date: depositAction.date_of_action,
              rp_value: isFirstDeposit ? 2000 : 1000,
            });
          }
        }
      }

      return depositConfirmed;
    } catch (error) {
      // Log error and return empty array to not break the profile endpoint
      console.error('Error fetching deposit confirmed data:', error);
      return [];
    }
  }

  async softDeleteUser(userId: number): Promise<void> {
    try {
      // Find the user
      const user = await this.playerRepository.findOne({
        where: { id: userId, is_deleted: false },
        select: [
          'id',
          'email',
          'name',
          'phone',
          'visitor_id',
          'device_udid',
          'auth_user_id',
          'avatar',
        ],
      });

      if (!user) {
        throw new NotFoundException('User not found or already deleted');
      }

      // Generate timestamp and anonymized data
      const timestamp = new Date().getTime();
      const anonymizedId = this.generateAnonymizedString(12);

      // Prepare update data for soft delete with anonymization
      const updateData: any = {
        is_deleted: true,
        deleted_at: new Date(),
        deletion_reason: 'Admin deletion',
        // Anonymize personal data fields with random gibberish
        name: `deleted_user_${anonymizedId}`,
        email: user.email ? `deleted_${anonymizedId}@deleted.local` : null,
        phone: user.phone ? `+00000${anonymizedId.substring(0, 8)}` : null,
        password: null,
        device_udid: null,
        auth_user_id: null,
        avatar: null,
        // visitor_id stays UNCHANGED to preserve casino actions relationship
        // AppsFlyer and tracking data anonymization
        pid: null,
        c: null,
        af_channel: null,
        af_adset: null,
        af_ad: null,
        af_keywords: null,
        is_retargeting: null,
        af_click_lookback: null,
        af_viewthrough_lookback: null,
        af_sub1: null,
        af_sub2: null,
        af_sub3: null,
        af_sub4: null,
        af_sub5: null,
        updated_at: new Date(),
      };

      // Perform the soft delete - casino actions are preserved
      await this.playerRepository.update({ id: userId }, updateData);
    } catch (error) {
      console.error('Error during soft delete:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Database operation failed');
    }
  }

  /**
   * Generates a random alphanumeric string for anonymization
   */
  private generateAnonymizedString(length: number): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
