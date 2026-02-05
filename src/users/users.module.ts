import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { CoinsBalanceChange } from '../entities/coins-balance-change.entity';
import { RpBalanceTransaction } from '../entities/rp-balance-transaction.entity';
import { InAppPurchase } from '../entities/in-app-purchase.entity';
import { CasinoAction } from '../entities/casino-action.entity';
import { Casino } from '../entities/casino.entity';
import { UsersService } from './services/users.service';
import { BalanceService } from './services/balance.service';
import { RpBalanceService } from './services/rp-balance.service';
import { RpRewardEventService } from './services/rp-reward-event.service';
import { CasinoOffersService } from './services/casino-offers.service';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from '../auth/auth.module';
import { CasinoApiModule } from '../external/casino/casino-api.module';
import { OneSignalModule } from '../external/onesignal/onesignal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      CoinsBalanceChange,
      RpBalanceTransaction,
      InAppPurchase,
      CasinoAction,
      Casino,
    ]),
    forwardRef(() => AuthModule), // Import AuthModule to get access to guards
    CasinoApiModule, // Import CasinoApiModule for external casino API calls
    OneSignalModule, // Import OneSignalModule to get access to OneSignalService
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    BalanceService,
    RpBalanceService,
    RpRewardEventService,
    CasinoOffersService,
  ],
  exports: [
    UsersService,
    BalanceService,
    RpBalanceService,
    RpRewardEventService,
  ],
})
export class UsersModule {}
