import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateExperienceDto {
  @ApiProperty({
    description: 'New experience value',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  experience: number;
}
