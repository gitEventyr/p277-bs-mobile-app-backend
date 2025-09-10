import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { CoinsBalanceChange } from '../entities/coins-balance-change.entity';
import { RpBalanceTransaction } from '../entities/rp-balance-transaction.entity';
import { UsersService } from './services/users.service';
import { BalanceService } from './services/balance.service';
import { RpBalanceService } from './services/rp-balance.service';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      CoinsBalanceChange,
      RpBalanceTransaction,
    ]),
    AuthModule, // Import AuthModule to get access to guards
  ],
  controllers: [UsersController],
  providers: [UsersService, BalanceService, RpBalanceService],
  exports: [UsersService, BalanceService, RpBalanceService],
})
export class UsersModule {}
