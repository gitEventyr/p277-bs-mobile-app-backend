import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoucherRequestDto {
  @ApiProperty({ description: 'ID of the voucher to request', example: 1 })
  @IsNumber()
  voucher_id: number;
}
