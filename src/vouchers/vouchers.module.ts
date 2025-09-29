import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '../entities/voucher.entity';
import { VoucherRequest } from '../entities/voucher-request.entity';
import { Player } from '../entities/player.entity';
import { RpBalanceTransaction } from '../entities/rp-balance-transaction.entity';
import { VoucherService } from './services/voucher.service';
import { VouchersController } from './controllers/vouchers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Voucher,
      VoucherRequest,
      Player,
      RpBalanceTransaction,
    ]),
  ],
  controllers: [VouchersController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VouchersModule {}
