import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GameHistoryFilterDto {
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a valid number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a valid number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @ApiProperty({
    example: 'Slot Machine Deluxe',
    description: 'Filter by game name',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Game name filter must be a string' })
  game_name?: string;

  @ApiProperty({
    example: 'created_at',
    description: 'Field to sort by',
    required: false,
    enum: ['created_at', 'bet', 'won', 'net_result'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['created_at', 'bet', 'won', 'net_result'], {
    message: 'Sort by must be one of: created_at, bet, won, net_result',
  })
  sort_by?: string = 'created_at';

  @ApiProperty({
    example: 'desc',
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'Sort order must be either asc or desc',
  })
  sort_order?: 'asc' | 'desc' = 'desc';
}

export class GameHistoryDto {
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
}

export class GameHistoryResponseDto {
  @ApiProperty({
    type: [GameHistoryDto],
    description: 'List of game sessions',
  })
  sessions: GameHistoryDto[];

  @ApiProperty({ example: 25, description: 'Total number of sessions' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Total number of pages' })
  total_pages: number;
}

export class GameStatsDto {
  @ApiProperty({ example: 25, description: 'Total number of game sessions' })
  total_sessions: number;

  @ApiProperty({ example: 1250, description: 'Total amount bet' })
  total_bet: number;

  @ApiProperty({ example: 1100, description: 'Total amount won' })
  total_won: number;

  @ApiProperty({ example: 1250, description: 'Total amount lost' })
  total_lost: number;

  @ApiProperty({
    example: -150,
    description: 'Net result (total won - total lost)',
  })
  net_result: number;

  @ApiProperty({ example: 0.88, description: 'Return to player percentage' })
  rtp_percentage: number;

  @ApiProperty({ example: 50, description: 'Average bet amount' })
  average_bet: number;

  @ApiProperty({ example: 44, description: 'Average won amount' })
  average_won: number;

  @ApiProperty({ example: 3, description: 'Number of different games played' })
  games_played: number;

  @ApiProperty({
    example: { 'Slot Machine Deluxe': 15, 'Poker Pro': 8, Blackjack: 2 },
    description: 'Games played breakdown',
  })
  game_breakdown: Record<string, number>;

  @ApiProperty({
    example: '2023-08-21T10:30:00Z',
    description: 'Last game session timestamp',
    nullable: true,
  })
  last_session: Date | null;

  @ApiProperty({
    example: '2023-08-15T09:15:00Z',
    description: 'First game session timestamp',
    nullable: true,
  })
  first_session: Date | null;
}
