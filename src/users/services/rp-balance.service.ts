import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { RpBalanceTransaction } from '../../entities/rp-balance-transaction.entity';
import { ModifyRpBalanceDto } from '../dto/rp-balance.dto';
import { OneSignalService } from '../../external/onesignal/onesignal.service';

@Injectable()
export class RpBalanceService {
  private readonly logger = new Logger(RpBalanceService.name);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(RpBalanceTransaction)
    private readonly rpTransactionRepository: Repository<RpBalanceTransaction>,
    private readonly dataSource: DataSource,
    private readonly oneSignalService: OneSignalService,
  ) {}

  async modifyRpBalance(
    userId: number,
    modifyRpBalanceDto: ModifyRpBalanceDto,
    adminId?: string,
  ) {
    if (modifyRpBalanceDto.amount === 0) {
      throw new BadRequestException('Amount cannot be zero');
    }

    const mode = this.determineMode(modifyRpBalanceDto.amount, adminId);

    return this.updateRpBalance(
      userId,
      modifyRpBalanceDto.amount,
      mode,
      modifyRpBalanceDto.reason,
      adminId,
    );
  }

  async adminAdjustRpBalance(
    userId: number,
    amount: number,
    reason: string,
    adminId: string,
  ) {
    if (amount === 0) {
      throw new BadRequestException('Amount cannot be zero');
    }

    const mode = `admin_${amount > 0 ? 'increase' : 'decrease'}`;

    return this.updateRpBalance(userId, amount, mode, reason, adminId);
  }

  private async updateRpBalance(
    userId: number,
    amount: number,
    mode: string,
    reason?: string,
    adminId?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock the player record for update
      const player = await queryRunner.manager.findOne(Player, {
        where: { id: userId, is_deleted: false },
        lock: { mode: 'pessimistic_write' },
      });

      if (!player) {
        throw new NotFoundException('User not found');
      }

      const balanceBefore = player.rp_balance;
      const balanceAfter = balanceBefore + amount;

      // Prevent negative balance
      if (balanceAfter < 0) {
        throw new BadRequestException('Insufficient RP balance');
      }

      // Update player RP balance
      await queryRunner.manager.update(Player, userId, {
        rp_balance: balanceAfter,
      });

      // Create RP balance transaction record
      const rpTransaction = queryRunner.manager.create(RpBalanceTransaction, {
        user_id: userId,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        amount: amount,
        mode: mode,
        reason: reason,
        admin_id: adminId,
      });

      await queryRunner.manager.save(rpTransaction);

      await queryRunner.commitTransaction();

      // Send OneSignal tags for RP balance changes (exclude admin adjustments)
      if (mode === 'increase' || mode === 'decrease') {
        await this.sendRpBalanceTags(player.visitor_id, balanceAfter);
      }

      return {
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        amount: amount,
        mode: mode,
        transaction_id: rpTransaction.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Send OneSignal tags for RP balance changes
   */
  private async sendRpBalanceTags(
    visitorId: string,
    newBalance: number,
  ): Promise<void> {
    try {
      if (!visitorId) {
        this.logger.warn(
          'Cannot send RP balance tags: visitor_id not found',
        );
        return;
      }

      const tags: Record<string, string> = {
        last_time_received_rp: new Date().toISOString(),
        RP_points_2500: newBalance >= 2500 ? 'true' : 'false',
      };

      this.logger.log(
        `Sending RP balance tags for visitor ${visitorId}: balance=${newBalance}, RP_points_2500=${tags.RP_points_2500}`,
      );

      await this.oneSignalService.updateUserTags(visitorId, tags);
    } catch (error) {
      this.logger.error(
        `Failed to send RP balance tags for visitor ${visitorId}`,
        error,
      );
    }
  }

  async getRpTransactionHistory(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] =
      await this.rpTransactionRepository.findAndCount({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
        skip,
        take: limit,
      });

    return {
      data: transactions,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getRpTransactionById(userId: number, transactionId: number) {
    const transaction = await this.rpTransactionRepository.findOne({
      where: { id: transactionId, user_id: userId },
    });

    if (!transaction) {
      throw new NotFoundException('RP transaction not found');
    }

    return transaction;
  }

  private determineMode(amount: number, adminId?: string): string {
    const baseMode = amount > 0 ? 'increase' : 'decrease';
    return adminId ? `admin_${baseMode}` : baseMode;
  }

  async getRpBalance(userId: number) {
    const player = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
      select: ['id', 'rp_balance'],
    });

    if (!player) {
      throw new NotFoundException('User not found');
    }

    return {
      rp_balance: player.rp_balance,
    };
  }
}
