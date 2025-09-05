import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
    description: 'External casino ID for third-party API integration',
    example: 'bella_vegas_123',
    required: false,
  })
  @IsOptional()
  @IsString()
  casino_id?: string;
}
