import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';

export class PlaySessionDto {
  @ApiProperty({
    example: 50,
    description: 'Amount bet in the game session',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Bet must be a valid number' })
  @Min(0, { message: 'Bet amount must be 0 or greater' })
  bet: number;

  @ApiProperty({
    example: 100,
    description: 'Amount won in the game session',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Won amount must be a valid number' })
  @Min(0, { message: 'Won amount must be 0 or greater' })
  won: number;

  @ApiProperty({
    example: 50,
    description: 'Amount lost in the game session',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Lost amount must be a valid number' })
  @Min(0, { message: 'Lost amount must be 0 or greater' })
  lost: number;

  @ApiProperty({
    example: 'Slot Machine Deluxe',
    description: 'Name of the game played',
    maxLength: 255,
  })
  @IsString({ message: 'Game name must be a string' })
  @IsNotEmpty({ message: 'Game name is required' })
  @MaxLength(255, { message: 'Game name cannot exceed 255 characters' })
  game_name: string;

  @ApiProperty({
    example: 'classic',
    description: 'Game mode or variant',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Game mode must be a string' })
  @MaxLength(100, { message: 'Game mode cannot exceed 100 characters' })
  game_mode?: string;

  @ApiProperty({
    example: 5,
    description: 'Session duration in minutes',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Session duration must be a valid number' })
  @Min(0, { message: 'Session duration must be 0 or greater' })
  session_duration?: number;
}

export class PlaySessionResponseDto {
  @ApiProperty({ example: 1, description: 'Game session ID' })
  id: number;

  @ApiProperty({ example: 50, description: 'Amount bet' })
  bet: number;

  @ApiProperty({ example: 100, description: 'Amount won' })
  won: number;

  @ApiProperty({ example: 50, description: 'Amount lost' })
  lost: number;

  @ApiProperty({ example: 50, description: 'Net result (won - lost)' })
  net_result: number;

  @ApiProperty({ example: 'Slot Machine Deluxe', description: 'Game name' })
  game_name: string;

  @ApiProperty({
    example: 'classic',
    description: 'Game mode',
    required: false,
  })
  game_mode?: string;

  @ApiProperty({
    example: 5,
    description: 'Session duration in minutes',
    required: false,
  })
  session_duration?: number;

  @ApiProperty({
    example: '2023-08-21T10:30:00Z',
    description: 'Session timestamp',
  })
  created_at: Date;

  @ApiProperty({
    example: {
      balance_before: 1000,
      balance_after: 1050,
      transaction_id: 123,
    },
    description: 'Balance change information',
    nullable: true,
  })
  balance_change: {
    balance_before: number;
    balance_after: number;
    transaction_id: number;
  } | null;
}
