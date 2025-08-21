import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';
import { Player } from '../../entities/player.entity';
import { BalanceService } from '../../users/services/balance.service';
import { PaymentValidationService } from '../../external/payments/payment-validation.service';
import {
  RecordPurchaseDto,
  PurchaseHistoryQueryDto,
} from '../dto/purchase.dto';

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    @InjectRepository(InAppPurchase)
    private readonly purchaseRepository: Repository<InAppPurchase>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly balanceService: BalanceService,
    private readonly paymentValidationService: PaymentValidationService,
    private readonly dataSource: DataSource,
  ) {}

  async recordPurchase(userId: number, purchaseDto: RecordPurchaseDto) {
    this.logger.log(
      `Recording purchase for user ${userId}, transaction: ${purchaseDto.transaction_id}`,
    );

    // Check if user exists
    const user = await this.playerRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for duplicate transaction
    const existingPurchase = await this.purchaseRepository.findOne({
      where: { transaction_id: purchaseDto.transaction_id },
    });

    if (existingPurchase) {
      throw new ConflictException('Transaction already recorded');
    }

    // Validate receipt if provided (optional for recording)
    if (purchaseDto.receipt_data) {
      const isValid = await this.paymentValidationService.validateReceipt(
        purchaseDto.platform,
        purchaseDto.receipt_data,
        purchaseDto.transaction_id,
      );

      if (!isValid) {
        this.logger.warn(
          `Receipt validation failed for transaction: ${purchaseDto.transaction_id}`,
        );
        // Note: We still record the purchase but log the validation failure
        // In production, you might want to handle this differently based on business rules
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create purchase record
      const purchase = queryRunner.manager.create(InAppPurchase, {
        user_id: userId,
        platform: purchaseDto.platform,
        product_id: purchaseDto.product_id,
        transaction_id: purchaseDto.transaction_id,
        amount: purchaseDto.amount,
        currency: purchaseDto.currency || 'USD',
        purchased_at: new Date(purchaseDto.purchased_at),
      });

      const savedPurchase = await queryRunner.manager.save(purchase);

      // Add coins to user balance
      const balanceUpdate = await this.balanceService.increaseBalance(userId, {
        amount: purchaseDto.coins_amount,
        mode: `purchase_${purchaseDto.product_id}`,
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        `Purchase recorded successfully: ${savedPurchase.id}, balance updated: ${balanceUpdate.balance_after}`,
      );

      return {
        purchase: {
          id: savedPurchase.id,
          platform: savedPurchase.platform,
          product_id: savedPurchase.product_id,
          transaction_id: savedPurchase.transaction_id,
          amount: savedPurchase.amount,
          currency: savedPurchase.currency,
          purchased_at: savedPurchase.purchased_at,
          created_at: savedPurchase.created_at,
        },
        balance_update: balanceUpdate,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to record purchase: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getPurchaseHistory(userId: number, queryDto: PurchaseHistoryQueryDto) {
    // Check if user exists
    const user = await this.playerRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const page = queryDto.page || 1;
    const limit = Math.min(queryDto.limit || 10, 100); // Cap at 100 per page
    const skip = (page - 1) * limit;

    const queryBuilder = this.purchaseRepository
      .createQueryBuilder('purchase')
      .where('purchase.user_id = :userId', { userId })
      .orderBy('purchase.created_at', 'DESC');

    // Apply platform filter if provided
    if (queryDto.platform) {
      queryBuilder.andWhere('purchase.platform = :platform', {
        platform: queryDto.platform,
      });
    }

    const [purchases, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: purchases.map((purchase) => ({
        id: purchase.id,
        platform: purchase.platform,
        product_id: purchase.product_id,
        transaction_id: purchase.transaction_id,
        amount: purchase.amount,
        currency: purchase.currency,
        purchased_at: purchase.purchased_at,
        created_at: purchase.created_at,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPurchaseById(userId: number, purchaseId: number) {
    const purchase = await this.purchaseRepository.findOne({
      where: { id: purchaseId, user_id: userId },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return {
      id: purchase.id,
      platform: purchase.platform,
      product_id: purchase.product_id,
      transaction_id: purchase.transaction_id,
      amount: purchase.amount,
      currency: purchase.currency,
      purchased_at: purchase.purchased_at,
      created_at: purchase.created_at,
    };
  }

  async validateReceipt(
    receiptData: string,
    transactionId: string,
    platform: string,
  ) {
    const isValid = await this.paymentValidationService.validateReceipt(
      platform,
      receiptData,
      transactionId,
    );

    return {
      valid: isValid,
      transaction_id: transactionId,
      platform,
      validated_at: new Date(),
    };
  }

  async getTotalSpent(userId: number): Promise<number> {
    const result = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .select('SUM(purchase.amount)', 'total')
      .where('purchase.user_id = :userId', { userId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getPurchaseStats(userId: number) {
    const [totalSpent, totalPurchases, recentPurchases] = await Promise.all([
      this.getTotalSpent(userId),
      this.purchaseRepository.count({ where: { user_id: userId } }),
      this.purchaseRepository.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      total_spent: totalSpent,
      total_purchases: totalPurchases,
      recent_purchases: recentPurchases.map((purchase) => ({
        id: purchase.id,
        product_id: purchase.product_id,
        amount: purchase.amount,
        purchased_at: purchase.purchased_at,
      })),
    };
  }
}
