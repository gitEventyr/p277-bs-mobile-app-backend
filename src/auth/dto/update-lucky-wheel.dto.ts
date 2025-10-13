import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateLuckyWheelDto {
  @ApiProperty({
    description: 'Lucky wheel count',
    example: 5,
    type: 'integer',
  })
  @IsNumber()
  @Min(0)
  lucky_wheel_count: number;
}

export class UpdateLuckyWheelResponseDto {
  @ApiProperty({
    example: 'Lucky wheel count updated successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    description: 'Updated lucky wheel count',
    example: 5,
  })
  lucky_wheel_count: number;
}
