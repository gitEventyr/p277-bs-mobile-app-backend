import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GamesService } from '../services/games.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  PlaySessionDto,
  PlaySessionResponseDto,
} from '../dto/play-session.dto';
import {
  GameHistoryFilterDto,
  GameHistoryDto,
  GameHistoryResponseDto,
  GameStatsDto,
} from '../dto/game-history.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@ApiTags('📱 Mobile: Gaming')
@Controller('games')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'Record a game session' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Game session recorded successfully',
    type: PlaySessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid game session data or insufficient balance',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Post('play-session')
  async recordPlaySession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() playSessionDto: PlaySessionDto,
  ): Promise<PlaySessionResponseDto> {
    return await this.gamesService.recordGameSession(user.id, playSessionDto);
  }

  @ApiOperation({ summary: 'Get player game history' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'game_name',
    required: false,
    type: String,
    example: 'Slot Machine',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: ['created_at', 'bet', 'won', 'net_result'],
  })
  @ApiQuery({ name: 'sort_order', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game history retrieved successfully',
    type: GameHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Get('history')
  async getGameHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filters: GameHistoryFilterDto,
  ): Promise<GameHistoryResponseDto> {
    return await this.gamesService.getGameHistory(user.id, filters);
  }

  @ApiOperation({ summary: 'Get specific game session details' })
  @ApiParam({
    name: 'id',
    description: 'Game session ID',
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game session details retrieved successfully',
    type: GameHistoryDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game session not found',
  })
  @Get('history/:id')
  async getGameSessionById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) sessionId: number,
  ): Promise<GameHistoryDto> {
    return await this.gamesService.getGameSessionById(user.id, sessionId);
  }

  @ApiOperation({ summary: 'Get player game statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game statistics retrieved successfully',
    type: GameStatsDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Get('stats')
  async getGameStats(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GameStatsDto> {
    return await this.gamesService.getGameStats(user.id);
  }

  @ApiOperation({ summary: 'Get popular games (public endpoint)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular games retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          game_name: { type: 'string', example: 'Slot Machine Deluxe' },
          play_count: { type: 'number', example: 1250 },
        },
      },
    },
  })
  @Get('popular')
  @SetMetadata('isPublic', true) // Make endpoint public
  async getPopularGames(
    @Query('limit') limit?: string,
  ): Promise<Array<{ game_name: string; play_count: number }>> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.gamesService.getPopularGames(limitNumber);
  }
}
