import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoucherType } from '../../entities/voucher.entity';

export class CreateVoucherDto {
  @ApiProperty({
    description: 'Voucher name',
    example: 'Amazon eGift Card $25',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'RP price for the voucher', example: 2500 })
  @IsNumber()
  @Min(0)
  rp_price: number;

  @ApiProperty({
    description: 'Equivalent value in real money for admin reference',
    example: 25,
  })
  @IsNumber()
  @Min(0)
  amazon_vouchers_equivalent: number;

  @ApiProperty({
    description: 'Type of voucher',
    enum: VoucherType,
    example: VoucherType.AMAZON_GIFT_CARD,
  })
  @IsEnum(VoucherType)
  type: VoucherType;
}
