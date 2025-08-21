import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from './controllers/purchases.controller';
import { PurchasesService } from './services/purchases.service';
import { PaymentValidationService } from '../external/payments/payment-validation.service';
import { InAppPurchase } from '../entities/in-app-purchase.entity';
import { Player } from '../entities/player.entity';
import { CoinsBalanceChange } from '../entities/coins-balance-change.entity';
import { BalanceService } from '../users/services/balance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InAppPurchase, Player, CoinsBalanceChange]),
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService, PaymentValidationService, BalanceService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
