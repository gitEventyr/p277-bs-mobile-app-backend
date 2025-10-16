import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCasinoDto {
  @ApiProperty({
    description: 'The updated name of the casino',
    example: 'Bella Vegas Casino - Updated',
  })
  @IsString()
  @IsNotEmpty()
  casino_name: string;

  @ApiProperty({
    description:
      'External casino ID for third-party API integration (must be numeric)',
    example: '456',
    required: false,
  })
  @IsOptional()
  @IsNumberString(
    {},
    { message: 'Casino ID must contain only numeric characters' },
  )
  casino_id?: string;
}
