import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty({ example: 1500.75 })
  coins_balance: number;

  @ApiProperty({ example: 0 })
  rp_balance: number;

  @ApiProperty({ example: 5 })
  scratch_cards: number;
}

export class BalanceChangeResponseDto {
  @ApiProperty({ example: 1000.5 })
  balance_before: number;

  @ApiProperty({ example: 1500.75 })
  balance_after: number;

  @ApiProperty({ example: 500.25 })
  amount: number;

  @ApiProperty({ example: 'game_win' })
  mode: string;

  @ApiProperty({ example: 12345 })
  transaction_id: number;
}

export class TransactionHistoryDto {
  @ApiProperty({ example: 12345 })
  id: number;

  @ApiProperty({ example: 1000.5 })
  balance_before: number;

  @ApiProperty({ example: 1500.75 })
  balance_after: number;

  @ApiProperty({ example: 500.25 })
  amount: number;

  @ApiProperty({ example: 'game_win' })
  mode: string;

  @ApiProperty({ example: 'completed' })
  status: string;

  @ApiProperty({ example: '2025-08-20T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-08-20T10:00:00Z' })
  updated_at: Date;
}

export class TransactionHistoryResponseDto {
  @ApiProperty({ type: [TransactionHistoryDto] })
  data: TransactionHistoryDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  pages: number;
}
