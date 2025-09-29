import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoucherRequestStatus } from '../../entities/voucher-request.entity';

export class UpdateVoucherRequestDto {
  @ApiProperty({
    description: 'Status of the voucher request',
    enum: VoucherRequestStatus,
  })
  @IsEnum(VoucherRequestStatus)
  status: VoucherRequestStatus;
}
