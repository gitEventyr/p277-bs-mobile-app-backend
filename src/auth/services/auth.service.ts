import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Player } from '../../entities/player.entity';
import { AdminUser } from '../../entities/admin-user.entity';
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
    private readonly jwtService: JwtService,
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
      select: ['id', 'email', 'name'],
    });

    if (!user) {
      throw new NotFoundException('User not found or already deleted');
    }

    // Soft delete the account and clear sensitive data (mobile API - no password verification needed)
    await this.playerRepository.query(
      `
      UPDATE players 
      SET is_deleted = true, 
          deleted_at = NOW(), 
          deletion_reason = $1,
          email = NULL,
          phone = NULL,
          name = NULL,
          password = NULL,
          updated_at = NOW()
      WHERE id = $2
    `,
      ['Mobile app account deletion', userId],
    );
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
