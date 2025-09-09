import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabaseConfig } from './config/database.config';
import { Player } from './entities/player.entity';
import { AdminUser } from './entities/admin-user.entity';
import { Device } from './entities/device.entity';
import { CoinsBalanceChange } from './entities/coins-balance-change.entity';
import { PlayHistory } from './entities/play-history.entity';
import { InAppPurchase } from './entities/in-app-purchase.entity';
import { Voucher } from './entities/voucher.entity';
import { UserVoucher } from './entities/user-voucher.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Casino } from './entities/casino.entity';
import { CasinoAction } from './entities/casino-action.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { GamesModule } from './games/games.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...createDatabaseConfig(configService),
        entities: [
          Player,
          AdminUser,
          Device,
          CoinsBalanceChange,
          PlayHistory,
          InAppPurchase,
          Voucher,
          UserVoucher,
          PasswordResetToken,
          Casino,
          CasinoAction,
        ],
      }),
    }),
    HealthModule,
    AuthModule,
    EmailModule,
    AdminModule,
    UsersModule,
    DevicesModule,
    GamesModule,
    PurchasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
