import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, IsInt } from 'class-validator';

export class ModifyRpBalanceDto {
  @ApiProperty({
    description:
      'Amount to modify (positive to increase, negative to decrease)',
    example: 100,
  })
  @IsInt()
  amount: number;

  @ApiProperty({
    description: 'Reason for the balance change',
    example: 'Reward points earned',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RpBalanceChangeResponseDto {
  @ApiProperty({ example: 500 })
  balance_before: number;

  @ApiProperty({ example: 600 })
  balance_after: number;

  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: 'increase' })
  mode: string;

  @ApiProperty({ example: 12345 })
  transaction_id: number;
}

export class RpBalanceTransactionHistoryDto {
  @ApiProperty({ example: 12345 })
  id: number;

  @ApiProperty({ example: 500 })
  balance_before: number;

  @ApiProperty({ example: 600 })
  balance_after: number;

  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: 'increase' })
  mode: string;

  @ApiProperty({ example: 'Reward points earned', required: false })
  reason?: string;

  @ApiProperty({ example: 'admin-123', required: false })
  admin_id?: string;

  @ApiProperty({ example: '2025-08-20T10:00:00Z' })
  created_at: Date;
}

export class RpBalanceTransactionHistoryResponseDto {
  @ApiProperty({ type: [RpBalanceTransactionHistoryDto] })
  data: RpBalanceTransactionHistoryDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  pages: number;
}
