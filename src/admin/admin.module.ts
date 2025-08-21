import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminUser } from '../entities/admin-user.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '30d') },
      }),
      inject: [ConfigService],
    }),
    AuthModule, // Import AuthModule to get access to guards
    UsersModule, // Import UsersModule to get access to UsersService
  ],
  controllers: [AdminController, AdminDashboardController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
