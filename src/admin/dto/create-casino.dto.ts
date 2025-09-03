import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCasinoDto {
  @ApiProperty({
    description: 'The name of the casino',
    example: 'Bella Vegas Casino',
  })
  @IsString()
  @IsNotEmpty()
  casino_name: string;
}