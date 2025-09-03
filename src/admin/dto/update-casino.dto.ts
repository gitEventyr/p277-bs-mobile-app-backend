import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCasinoDto {
  @ApiProperty({
    description: 'The updated name of the casino',
    example: 'Bella Vegas Casino - Updated',
  })
  @IsString()
  @IsNotEmpty()
  casino_name: string;
}