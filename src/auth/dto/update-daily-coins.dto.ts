import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class UpdateDailyCoinsDto {
  @ApiProperty({
    description: 'Daily coins days count (max 7)',
    example: 3,
    type: 'integer',
    minimum: 0,
    maximum: 7,
  })
  @IsNumber()
  @Min(0)
  @Max(7)
  daily_coins_days_count: number;
}

export class UpdateDailyCoinsResponseDto {
  @ApiProperty({
    example: 'Daily coins updated successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    description: 'Updated daily coins days count',
    example: 3,
  })
  daily_coins_days_count: number;

  @ApiProperty({
    description: 'Timestamp of last reward',
    example: '2025-09-30T12:00:00.000Z',
  })
  daily_coins_last_reward: Date;
}