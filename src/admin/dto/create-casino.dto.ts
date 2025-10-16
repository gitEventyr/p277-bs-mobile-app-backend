import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCasinoDto {
  @ApiProperty({
    description: 'The name of the casino',
    example: 'Bella Vegas Casino',
  })
  @IsString()
  @IsNotEmpty()
  casino_name: string;

  @ApiProperty({
    description:
      'External casino ID for third-party API integration (must be numeric)',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsNumberString(
    {},
    { message: 'Casino ID must contain only numeric characters' },
  )
  casino_id?: string;
}
