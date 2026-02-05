import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../entities/voucher.entity';
import { VoucherRequest } from '../entities/voucher-request.entity';
import { Player } from '../entities/player.entity';
import { RpBalanceTransaction } from '../entities/rp-balance-transaction.entity';
import { VoucherService } from './services/voucher.service';
import { VouchersController } from './controllers/vouchers.controller';
import { OneSignalModule } from '../external/onesignal/onesignal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Voucher,
      VoucherRequest,
      Player,
      RpBalanceTransaction,
    ]),
    OneSignalModule, // Import OneSignalModule to get access to OneSignalService
  ],
  controllers: [VouchersController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VouchersModule {}
