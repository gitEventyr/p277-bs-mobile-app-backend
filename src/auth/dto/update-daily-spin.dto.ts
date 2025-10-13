import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsDateString } from 'class-validator';

export class UpdateDailySpinDto {
  @ApiProperty({
    description: 'Daily spin wheel day count',
    example: 1,
    type: 'integer',
  })
  @IsNumber()
  @Min(0)
  daily_spin_wheel_day_count: number;

  @ApiPropertyOptional({
    description:
      'Optional timestamp for last spin (ISO 8601 format). If not provided, current time will be used.',
    example: '2025-09-30T12:00:00.000Z',
    type: 'string',
  })
  @IsOptional()
  @IsDateString()
  daily_spin_wheel_last_spin?: string;
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
