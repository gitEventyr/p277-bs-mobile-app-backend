import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { CoinsBalanceChange } from '../../entities/coins-balance-change.entity';
import { BalanceChangeDto, ModifyBalanceDto } from '../dto/balance-change.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(CoinsBalanceChange)
    private readonly balanceChangeRepository: Repository<CoinsBalanceChange>,
    private readonly dataSource: DataSource,
  ) {}

  async getBalance(userId: number) {
    const player = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
      select: ['id', 'coins_balance', 'rp_balance', 'scratch_cards'],
    });

    if (!player) {
      throw new NotFoundException('User not found');
    }

    return {
      coins_balance: player.coins_balance,
      rp_balance: player.rp_balance,
      scratch_cards: player.scratch_cards,
    };
  }

  async increaseBalance(userId: number, balanceChangeDto: BalanceChangeDto) {
    if (balanceChangeDto.amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return this.updateBalance(
      userId,
      balanceChangeDto.amount,
      balanceChangeDto.mode || 'increase',
    );
  }

  async decreaseBalance(userId: number, balanceChangeDto: BalanceChangeDto) {
    if (balanceChangeDto.amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return this.updateBalance(
      userId,
      -balanceChangeDto.amount,
      balanceChangeDto.mode || 'decrease',
    );
  }

  async modifyBalance(userId: number, modifyBalanceDto: ModifyBalanceDto) {
    if (modifyBalanceDto.amount === 0) {
      throw new BadRequestException('Amount cannot be zero');
    }

    const mode =
      modifyBalanceDto.mode ||
      (modifyBalanceDto.amount > 0 ? 'increase' : 'decrease');

    return this.updateBalance(userId, modifyBalanceDto.amount, mode);
  }

  private async updateBalance(userId: number, amount: number, mode: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock the player record for update
      const player = await queryRunner.manager.findOne(Player, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!player) {
        throw new NotFoundException('User not found');
      }

      const balanceBefore = player.coins_balance;
      const balanceAfter = balanceBefore + amount;

      // Prevent negative balance
      if (balanceAfter < 0) {
        throw new BadRequestException('Insufficient balance');
      }

      // Update player balance
      await queryRunner.manager.update(Player, userId, {
        coins_balance: balanceAfter,
      });

      // Create balance change record
      const balanceChange = queryRunner.manager.create(CoinsBalanceChange, {
        user_id: userId,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        amount: amount,
        mode: mode,
        status: 'completed',
      });

      await queryRunner.manager.save(balanceChange);

      await queryRunner.commitTransaction();

      return {
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        amount: amount,
        mode: mode,
        transaction_id: balanceChange.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactionHistory(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] =
      await this.balanceChangeRepository.findAndCount({
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

  async getTransactionById(userId: number, transactionId: number) {
    const transaction = await this.balanceChangeRepository.findOne({
      where: { id: transactionId, user_id: userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async adminAdjustBalance(userId: number, amount: number, reason: string) {
    const balanceChangeDto: BalanceChangeDto = {
      amount: Math.abs(amount),
      mode: `admin_adjustment_${amount >= 0 ? 'increase' : 'decrease'}_${reason}`,
    };

    if (amount >= 0) {
      return this.increaseBalance(userId, balanceChangeDto);
    } else {
      return this.decreaseBalance(userId, balanceChangeDto);
    }
  }
}
