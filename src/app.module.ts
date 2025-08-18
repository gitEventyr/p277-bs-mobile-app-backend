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
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        ],
      }),
    }),
    HealthModule,
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
