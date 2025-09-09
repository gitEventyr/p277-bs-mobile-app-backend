import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLevelDto {
  @ApiProperty({
    description: 'User level',
    example: 5,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Level must be a number' })
  @Min(1, { message: 'Level must be at least 1' })
  level: number;
}
