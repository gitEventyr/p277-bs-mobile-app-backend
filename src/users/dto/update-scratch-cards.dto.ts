import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScratchCardsDto {
  @ApiProperty({
    description: 'Number of scratch cards',
    example: 10,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Scratch cards must be a number' })
  @Min(0, { message: 'Scratch cards must be at least 0' })
  scratch_cards: number;
}
