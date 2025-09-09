import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminUser } from '../entities/admin-user.entity';
import { Player } from '../entities/player.entity';
import { PlayHistory } from '../entities/play-history.entity';
import { InAppPurchase } from '../entities/in-app-purchase.entity';
import { CoinsBalanceChange } from '../entities/coins-balance-change.entity';
import { Casino } from '../entities/casino.entity';
import { CasinoAction } from '../entities/casino-action.entity';
import { AdminService } from './services/admin.service';
import { AnalyticsService } from './services/analytics.service';
import { CasinoService } from './services/casino.service';
import { CasinoActionService } from './services/casino-action.service';
import { AdminController } from './controllers/admin.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { CasinoController } from './controllers/casino.controller';
import { CasinoActionController } from './controllers/casino-action.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CasinoApiModule } from '../external/casino/casino-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminUser,
      Player,
      PlayHistory,
      InAppPurchase,
      CoinsBalanceChange,
      Casino,
      CasinoAction,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '30d'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule, // Import AuthModule to get access to guards
    UsersModule, // Import UsersModule to get access to UsersService
    CasinoApiModule, // Import CasinoApiModule to get access to CasinoApiService
  ],
  controllers: [
    AdminController,
    AdminDashboardController,
    AnalyticsController,
    CasinoController,
    CasinoActionController,
  ],
  providers: [
    AdminService,
    AnalyticsService,
    CasinoService,
    CasinoActionService,
  ],
  exports: [AdminService, AnalyticsService, CasinoService, CasinoActionService],
})
export class AdminModule {}
