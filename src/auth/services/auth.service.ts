import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Player } from '../../entities/player.entity';
import { AdminUser } from '../../entities/admin-user.entity';
import { CasinoAction } from '../../entities/casino-action.entity';
import {
  JwtPayload,
  AuthenticatedUser,
  AuthenticatedAdmin,
  SessionUser,
} from '../../common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    @InjectRepository(CasinoAction)
    private readonly casinoActionRepository: Repository<CasinoAction>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async generateJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verifyJwtToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  generateResetCode(): string {
    // Generate 6-digit random code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async validateUser(
    payload: JwtPayload,
  ): Promise<AuthenticatedUser | AuthenticatedAdmin | null> {
    if (payload.type === 'user') {
      const userId =
        typeof payload.sub === 'string' ? parseInt(payload.sub) : payload.sub;
      return this.validatePlayer(userId);
    } else if (payload.type === 'admin') {
      const adminId =
        typeof payload.sub === 'number' ? payload.sub.toString() : payload.sub;
      return this.validateAdmin(adminId);
    }
    return null;
  }

  async validatePlayer(playerId: number): Promise<AuthenticatedUser | null> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId, is_deleted: false },
      select: [
        'id',
        'email',
        'name',
        'visitor_id',
        'coins_balance',
        'level',
        'scratch_cards',
        'is_deleted',
        'avatar',
      ],
    });

    if (!player || player.is_deleted) {
      return null;
    }

    return {
      id: typeof player.id === 'string' ? parseInt(player.id) : player.id,
      email: player.email,
      name: player.name,
      visitor_id: player.visitor_id,
      coins_balance: player.coins_balance,
      level: player.level,
      scratch_cards: player.scratch_cards,
      avatar: player.avatar,
    };
  }

  async validateAdmin(adminId: string): Promise<AuthenticatedAdmin | null> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId, is_active: true },
      select: ['id', 'email', 'display_name', 'is_active'],
    });

    if (!admin) {
      return null;
    }

    // Update last login timestamp
    await this.adminRepository.update(adminId, {
      last_login_at: new Date(),
    });

    return {
      id: admin.id,
      email: admin.email,
      display_name: admin.display_name,
      is_active: admin.is_active,
    };
  }

  createSessionUser(
    user: AuthenticatedUser | AuthenticatedAdmin,
    type: 'user' | 'admin',
  ): SessionUser {
    return {
      userId: typeof user.id === 'string' ? parseInt(user.id) : user.id,
      email: user.email,
      type,
    };
  }

  async softDeleteAccount(userId: number): Promise<void> {
    // Find the user
    const user = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
      select: ['id', 'email', 'name', 'phone', 'visitor_id'],
    });

    if (!user) {
      throw new NotFoundException('User not found or already deleted');
    }

    // Create unique suffixes to avoid constraint violations
    const timestamp = new Date().getTime();
    const emailSuffix = user.email ? `_deleted_${timestamp}` : null;
    const phoneSuffix = user.phone ? `_deleted_${timestamp}` : null;
    const newVisitorId = `${user.visitor_id}_deleted_${timestamp}`;

    // Use a transaction to handle foreign key updates atomically
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Temporarily drop the foreign key constraint
      await queryRunner.query(
        `ALTER TABLE casino_actions DROP CONSTRAINT "FK_609382032637fbe3cd5d96757bd"`,
      );

      // Update the player record with new visitor_id
      const newEmail = user.email && emailSuffix ? user.email + emailSuffix : user.email;
      const newPhone = user.phone && phoneSuffix ? user.phone + phoneSuffix : user.phone;

      await queryRunner.query(
        `UPDATE players
         SET is_deleted = true,
             deleted_at = NOW(),
             deletion_reason = 'Mobile app account deletion',
             name = NULL,
             password = NULL,
             updated_at = NOW(),
             email = $1,
             phone = $2,
             visitor_id = $3
         WHERE id = $4`,
        [newEmail, newPhone, newVisitorId, userId],
      );

      // Update all related casino actions to use the new visitor_id
      await queryRunner.query(
        `UPDATE casino_actions
         SET visitor_id = $1,
             updated_at = NOW()
         WHERE visitor_id = $2`,
        [newVisitorId, user.visitor_id],
      );

      // Recreate the foreign key constraint
      await queryRunner.query(
        `ALTER TABLE casino_actions
         ADD CONSTRAINT "FK_609382032637fbe3cd5d96757bd"
         FOREIGN KEY (visitor_id) REFERENCES players(visitor_id)`,
      );

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback on error
      await queryRunner.rollbackTransaction();
      console.error('Error during soft delete:', error);
      throw new BadRequestException('Database operation failed');
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  // Note: In a real implementation with session management,
  // this would also invalidate the JWT token in a blacklist or Redis
  async logout(): Promise<void> {
    // For JWT tokens, logout is typically handled client-side by removing the token
    // In a future implementation with Redis session storage, we would:
    // 1. Remove the session from Redis
    // 2. Add the JWT token to a blacklist
    // For now, this is a no-op as the client will remove the token
  }
}
