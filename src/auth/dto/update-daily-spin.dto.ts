import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateDailySpinDto {
  @ApiProperty({
    description: 'Daily spin wheel day count',
    example: 1,
    type: 'integer',
  })
  @IsNumber()
  @Min(0)
  daily_spin_wheel_day_count: number;
}

export class UpdateDailySpinResponseDto {
  @ApiProperty({
    example: 'Daily spin updated successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    description: 'Updated daily spin wheel day count',
    example: 1,
  })
  daily_spin_wheel_day_count: number;

  @ApiProperty({
    description: 'Timestamp of last spin',
    example: '2025-09-30T12:00:00.000Z',
  })
  daily_spin_wheel_last_spin: Date;
}
