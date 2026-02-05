import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Voucher } from '../../entities/voucher.entity';
import {
  VoucherRequest,
  VoucherRequestStatus,
} from '../../entities/voucher-request.entity';
import { Player } from '../../entities/player.entity';
import { RpBalanceTransaction } from '../../entities/rp-balance-transaction.entity';
import { OneSignalService } from '../../external/onesignal/onesignal.service';

@Injectable()
export class VoucherService {
  private readonly logger = new Logger(VoucherService.name);

  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherRequest)
    private readonly voucherRequestRepository: Repository<VoucherRequest>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(RpBalanceTransaction)
    private readonly rpTransactionRepository: Repository<RpBalanceTransaction>,
    private readonly dataSource: DataSource,
    private readonly oneSignalService: OneSignalService,
  ) {}

  async findAllVouchers(): Promise<Voucher[]> {
    return this.voucherRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async createVoucherRequest(
    userId: number,
    voucherId: number,
  ): Promise<{ voucherRequest: VoucherRequest; rpTransaction: any }> {
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

      // Check if user has verified their email
      if (!player.email_verified) {
        throw new BadRequestException(
          'Email verification required. Please verify your email address before requesting vouchers.',
        );
      }

      // Find the voucher
      const voucher = await queryRunner.manager.findOne(Voucher, {
        where: { id: voucherId },
      });

      if (!voucher) {
        throw new NotFoundException('Voucher not found');
      }

      // Check if user has enough RP balance
      if (player.rp_balance < voucher.rp_price) {
        throw new BadRequestException(
          `Insufficient RP balance. Required: ${voucher.rp_price} RP, Available: ${player.rp_balance} RP`,
        );
      }

      const balanceBefore = player.rp_balance;
      const balanceAfter = balanceBefore - voucher.rp_price;

      // Update player RP balance
      await queryRunner.manager.update(Player, userId, {
        rp_balance: balanceAfter,
      });

      // Create RP balance transaction record
      const rpTransaction = queryRunner.manager.create(RpBalanceTransaction, {
        user_id: userId,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        amount: -voucher.rp_price, // Negative amount for deduction
        mode: 'voucher_purchase',
        reason: `Voucher purchase: ${voucher.name}`,
      });

      await queryRunner.manager.save(rpTransaction);

      // Create the voucher request
      const voucherRequest = queryRunner.manager.create(VoucherRequest, {
        user_id: userId,
        voucher_id: voucherId,
        request_date: new Date(),
        status: VoucherRequestStatus.REQUESTED,
      });

      const savedVoucherRequest =
        await queryRunner.manager.save(voucherRequest);

      await queryRunner.commitTransaction();

      // Send OneSignal tags for RP balance change (only RP_points_2500, not last_time_received_rp since this is a deduction)
      await this.sendRpBalanceTag(player.visitor_id, balanceAfter);

      // Load the relations for the response
      const requestWithRelations = await this.voucherRequestRepository.findOne({
        where: { id: savedVoucherRequest.id },
        relations: ['user', 'voucher'],
      });

      if (!requestWithRelations) {
        throw new Error('Failed to retrieve created voucher request');
      }

      return {
        voucherRequest: requestWithRelations,
        rpTransaction: {
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          amount: -voucher.rp_price,
          mode: 'voucher_purchase',
          transaction_id: rpTransaction.id,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Send OneSignal RP_points_2500 tag after voucher purchase
   * Note: We only send RP_points_2500 (not last_time_received_rp) because voucher purchase is a deduction, not receipt
   */
  private async sendRpBalanceTag(
    visitorId: string,
    newBalance: number,
  ): Promise<void> {
    try {
      if (!visitorId) {
        this.logger.warn(
          'Cannot send RP balance tag: visitor_id not found',
        );
        return;
      }

      const tags: Record<string, string> = {
        RP_points_2500: newBalance >= 2500 ? 'true' : 'false',
      };

      this.logger.log(
        `Sending RP balance tag for visitor ${visitorId} after voucher purchase: balance=${newBalance}, RP_points_2500=${tags.RP_points_2500}`,
      );

      await this.oneSignalService.updateUserTags(visitorId, tags);
    } catch (error) {
      this.logger.error(
        `Failed to send RP balance tag for visitor ${visitorId}`,
        error,
      );
    }
  }
}
