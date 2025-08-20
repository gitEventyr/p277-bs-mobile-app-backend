import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { CoinsBalanceChange } from '../entities/coins-balance-change.entity';
import { UsersService } from './services/users.service';
import { BalanceService } from './services/balance.service';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, CoinsBalanceChange]),
    AuthModule, // Import AuthModule to get access to guards
  ],
  controllers: [UsersController],
  providers: [UsersService, BalanceService],
  exports: [UsersService, BalanceService],
})
export class UsersModule {}
