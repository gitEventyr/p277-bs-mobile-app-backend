import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
    description: 'External casino ID for third-party API integration',
    example: 'bella_vegas_updated_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  casino_id?: string;
}
