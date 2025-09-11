import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpBalanceService } from './rp-balance.service';
import { InAppPurchase } from '../../entities/in-app-purchase.entity';

export enum RpRewardEvent {
  EMAIL_VERIFICATION = 'email_verification',
  PHONE_VERIFICATION = 'phone_verification',
  REGISTRATION = 'registration',
  FIRST_PURCHASE = 'first_purchase',
  PURCHASE = 'purchase',
}

@Injectable()
export class RpRewardEventService {
  private readonly logger = new Logger(RpRewardEventService.name);

  private readonly rewardAmounts = {
    [RpRewardEvent.EMAIL_VERIFICATION]: 50,
    [RpRewardEvent.PHONE_VERIFICATION]: 50,
    [RpRewardEvent.REGISTRATION]: 100,
    [RpRewardEvent.FIRST_PURCHASE]: 2000,
    [RpRewardEvent.PURCHASE]: 1000,
  };

  constructor(
    private readonly rpBalanceService: RpBalanceService,
    @InjectRepository(InAppPurchase)
    private readonly purchaseRepository: Repository<InAppPurchase>,
  ) {}

  async awardRpForEvent(
    userId: number,
    event: RpRewardEvent,
    reason?: string,
  ): Promise<void> {
    const amount = this.rewardAmounts[event];
    const eventReason = reason || this.getDefaultReason(event);

    try {
      await this.rpBalanceService.modifyRpBalance(userId, {
        amount,
        reason: eventReason,
      });

      this.logger.log(
        `Awarded ${amount} RP to user ${userId} for event: ${event}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to award RP for event ${event} to user ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async awardEmailVerificationReward(userId: number): Promise<void> {
    await this.awardRpForEvent(
      userId,
      RpRewardEvent.EMAIL_VERIFICATION,
      'Email verification reward',
    );
  }

  async awardPhoneVerificationReward(userId: number): Promise<void> {
    await this.awardRpForEvent(
      userId,
      RpRewardEvent.PHONE_VERIFICATION,
      'Phone verification reward',
    );
  }

  async awardRegistrationReward(userId: number): Promise<void> {
    await this.awardRpForEvent(
      userId,
      RpRewardEvent.REGISTRATION,
      'Registration completion reward',
    );
  }

  async awardPurchaseReward(userId: number, productId?: string): Promise<void> {
    const isFirstPurchase = await this.isUserFirstPurchase(userId);

    if (isFirstPurchase) {
      await this.awardRpForEvent(
        userId,
        RpRewardEvent.FIRST_PURCHASE,
        `First purchase reward${productId ? ` (${productId})` : ''}`,
      );
    } else {
      await this.awardRpForEvent(
        userId,
        RpRewardEvent.PURCHASE,
        `Purchase reward${productId ? ` (${productId})` : ''}`,
      );
    }
  }

  private async isUserFirstPurchase(userId: number): Promise<boolean> {
    const purchaseCount = await this.purchaseRepository.count({
      where: { user_id: userId },
    });
    return purchaseCount === 1; // This is the first purchase if count is 1 (just recorded)
  }

  private getDefaultReason(event: RpRewardEvent): string {
    const reasonMap = {
      [RpRewardEvent.EMAIL_VERIFICATION]: 'Email verification reward',
      [RpRewardEvent.PHONE_VERIFICATION]: 'Phone verification reward',
      [RpRewardEvent.REGISTRATION]: 'Registration completion reward',
      [RpRewardEvent.FIRST_PURCHASE]: 'First purchase reward',
      [RpRewardEvent.PURCHASE]: 'Purchase reward',
    };
    return reasonMap[event];
  }
}
