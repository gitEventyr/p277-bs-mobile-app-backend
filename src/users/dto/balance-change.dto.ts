import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min, IsInt } from 'class-validator';

export class BalanceChangeDto {
  @ApiProperty({
    example: 100.5,
    description: 'Amount to change (positive number)',
  })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    example: 'game_win',
    description: 'Mode of balance change',
    enum: [
      'game_win',
      'game_loss',
      'purchase',
      'bet',
      'admin_adjustment',
      'bonus',
      'refund',
      'increase',
      'decrease',
    ],
    required: false,
  })
  @IsOptional()
  @IsString()
  mode?: string;

  @ApiProperty({
    example: 'Win from Slot Machine - Session 123',
    description: 'Description of the balance change',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ModifyBalanceDto {
  @ApiProperty({
    example: 100,
    description:
      'Amount to modify (positive for increase, negative for decrease)',
  })
  @IsInt()
  amount: number;

  @ApiProperty({
    example: 'game_win',
    description: 'Mode of balance change',
    enum: [
      'game_win',
      'game_loss',
      'purchase',
      'bet',
      'admin_adjustment',
      'bonus',
      'refund',
    ],
    required: false,
  })
  @IsOptional()
  @IsString()
  mode?: string;

  @ApiProperty({
    example: 'Win from Slot Machine - Session 123',
    description: 'Description of the balance change',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AdminBalanceAdjustmentDto {
  @ApiProperty({
    example: 100.5,
    description: 'Amount to adjust (can be positive or negative)',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'compensation_for_issue',
    description: 'Reason for balance adjustment',
  })
  @IsString()
  reason: string;
}
