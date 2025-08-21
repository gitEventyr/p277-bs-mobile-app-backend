import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayHistory } from '../../entities/play-history.entity';
import { Player } from '../../entities/player.entity';
import { BalanceService } from '../../users/services/balance.service';
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

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(PlayHistory)
    private readonly playHistoryRepository: Repository<PlayHistory>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly balanceService: BalanceService,
  ) {}

  async recordGameSession(
    userId: number,
    playSessionDto: PlaySessionDto,
  ): Promise<PlaySessionResponseDto> {
    this.logger.log(
      `Recording game session for user ${userId}: ${playSessionDto.game_name}`,
    );

    // Validate the game session data
    this.validateGameSession(playSessionDto);

    // Calculate net result
    const netResult = playSessionDto.won - playSessionDto.lost;

    // Start transaction by creating the play history record first
    const gameSession = this.playHistoryRepository.create({
      user_id: userId,
      bet: playSessionDto.bet,
      won: playSessionDto.won,
      lost: playSessionDto.lost,
      game_name: playSessionDto.game_name,
    });

    const savedSession = await this.playHistoryRepository.save(gameSession);
    this.logger.log(
      `Game session ${savedSession.id} created for user ${userId}`,
    );

    // Update player balance based on net result
    let balanceChange;
    try {
      if (netResult > 0) {
        // Player won money - increase balance
        balanceChange = await this.balanceService.increaseBalance(userId, {
          amount: netResult,
          mode: 'game_win',
          description: `Win from ${playSessionDto.game_name} - Session ${savedSession.id}`,
        });
        this.logger.log(
          `Increased balance by ${netResult} for user ${userId} - game win`,
        );
      } else if (netResult < 0) {
        // Player lost money - decrease balance
        const lossAmount = Math.abs(netResult);
        balanceChange = await this.balanceService.decreaseBalance(userId, {
          amount: lossAmount,
          mode: 'game_loss',
          description: `Loss from ${playSessionDto.game_name} - Session ${savedSession.id}`,
        });
        this.logger.log(
          `Decreased balance by ${lossAmount} for user ${userId} - game loss`,
        );
      } else {
        // No net change - but we still record the session
        this.logger.log(
          `No balance change for user ${userId} - break even game`,
        );
        balanceChange = null;
      }
    } catch (balanceError) {
      this.logger.error(
        `Failed to update balance for user ${userId}:`,
        balanceError.message,
      );
      // Delete the game session since balance update failed
      await this.playHistoryRepository.delete(savedSession.id);
      throw balanceError;
    }

    // Return the complete session response
    return {
      id: savedSession.id,
      bet: savedSession.bet,
      won: savedSession.won,
      lost: savedSession.lost,
      net_result: netResult,
      game_name: savedSession.game_name,
      game_mode: playSessionDto.game_mode,
      session_duration: playSessionDto.session_duration,
      created_at: savedSession.created_at,
      balance_change: balanceChange
        ? {
            balance_before: balanceChange.balance_before,
            balance_after: balanceChange.balance_after,
            transaction_id: balanceChange.transaction_id,
          }
        : null,
    };
  }

  async getGameHistory(
    userId: number,
    filters: GameHistoryFilterDto,
  ): Promise<GameHistoryResponseDto> {
    const {
      page = 1,
      limit = 10,
      game_name,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = filters;
    const skip = (page - 1) * limit;

    let queryBuilder = this.playHistoryRepository
      .createQueryBuilder('play_history')
      .where('play_history.user_id = :userId', { userId });

    // Apply game name filter if provided
    if (game_name) {
      queryBuilder = queryBuilder.andWhere(
        'play_history.game_name ILIKE :gameName',
        {
          gameName: `%${game_name}%`,
        },
      );
    }

    // Apply sorting
    const sortField = `play_history.${sort_by}`;
    queryBuilder = queryBuilder.orderBy(
      sortField,
      sort_order.toUpperCase() as 'ASC' | 'DESC',
    );

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply pagination and get results
    const sessions = await queryBuilder.skip(skip).take(limit).getMany();

    // Transform to response format
    const sessionHistory: GameHistoryDto[] = sessions.map((session) => ({
      id: session.id,
      bet: session.bet,
      won: session.won,
      lost: session.lost,
      net_result: session.won - session.lost,
      game_name: session.game_name,
      created_at: session.created_at,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      sessions: sessionHistory,
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  async getGameSessionById(
    userId: number,
    sessionId: number,
  ): Promise<GameHistoryDto> {
    const session = await this.playHistoryRepository.findOne({
      where: { id: sessionId, user_id: userId },
    });

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    return {
      id: session.id,
      bet: session.bet,
      won: session.won,
      lost: session.lost,
      net_result: session.won - session.lost,
      game_name: session.game_name,
      created_at: session.created_at,
    };
  }

  async getGameStats(userId: number): Promise<GameStatsDto> {
    // Get all sessions for the user
    const sessions = await this.playHistoryRepository.find({
      where: { user_id: userId },
      order: { created_at: 'ASC' },
    });

    if (sessions.length === 0) {
      return {
        total_sessions: 0,
        total_bet: 0,
        total_won: 0,
        total_lost: 0,
        net_result: 0,
        rtp_percentage: 0,
        average_bet: 0,
        average_won: 0,
        games_played: 0,
        game_breakdown: {},
        last_session: null,
        first_session: null,
      };
    }

    // Calculate statistics
    const totalBet = sessions.reduce((sum, session) => sum + session.bet, 0);
    const totalWon = sessions.reduce((sum, session) => sum + session.won, 0);
    const totalLost = sessions.reduce((sum, session) => sum + session.lost, 0);
    const netResult = totalWon - totalLost;
    const rtpPercentage = totalBet > 0 ? totalWon / totalBet : 0;

    // Calculate game breakdown
    const gameBreakdown: Record<string, number> = {};
    sessions.forEach((session) => {
      gameBreakdown[session.game_name] =
        (gameBreakdown[session.game_name] || 0) + 1;
    });

    const gamesPlayed = Object.keys(gameBreakdown).length;
    const lastSession = sessions[sessions.length - 1];
    const firstSession = sessions[0];

    return {
      total_sessions: sessions.length,
      total_bet: totalBet,
      total_won: totalWon,
      total_lost: totalLost,
      net_result: netResult,
      rtp_percentage: Math.round(rtpPercentage * 10000) / 100, // Round to 2 decimal places
      average_bet: totalBet / sessions.length,
      average_won: totalWon / sessions.length,
      games_played: gamesPlayed,
      game_breakdown: gameBreakdown,
      last_session: lastSession.created_at,
      first_session: firstSession.created_at,
    };
  }

  private validateGameSession(playSessionDto: PlaySessionDto): void {
    const { bet, won, lost } = playSessionDto;

    // Basic validation - bet should generally equal won + lost for most games
    // However, we'll allow some flexibility for bonus rounds, free spins, etc.
    if (bet < 0 || won < 0 || lost < 0) {
      throw new BadRequestException(
        'Bet, won, and lost amounts must be non-negative',
      );
    }

    // Validate that the amounts make logical sense
    if (bet === 0 && (won > 0 || lost > 0)) {
      throw new BadRequestException('Cannot have wins or losses without a bet');
    }

    // For most games, won + lost should not exceed bet by too much
    // Allow some flexibility for bonus features
    const totalPayout = won + lost;
    if (totalPayout > bet * 10) {
      // Allow up to 10x bet for bonus features
      throw new BadRequestException(
        'Win/loss amounts seem unrealistic compared to bet amount',
      );
    }

    // Game name validation
    if (
      !playSessionDto.game_name ||
      playSessionDto.game_name.trim().length === 0
    ) {
      throw new BadRequestException('Game name is required');
    }

    this.logger.log(
      `Game session validation passed: bet=${bet}, won=${won}, lost=${lost}, game=${playSessionDto.game_name}`,
    );
  }

  // Admin/analytics methods
  async getTotalGameSessions(): Promise<number> {
    return await this.playHistoryRepository.count();
  }

  async getTotalGameRevenue(): Promise<number> {
    const result = await this.playHistoryRepository
      .createQueryBuilder('play_history')
      .select('SUM(play_history.lost) - SUM(play_history.won)', 'revenue')
      .getRawOne();

    return parseFloat(result?.revenue || '0');
  }

  async getPopularGames(
    limit: number = 10,
  ): Promise<Array<{ game_name: string; play_count: number }>> {
    const result = await this.playHistoryRepository
      .createQueryBuilder('play_history')
      .select('play_history.game_name', 'game_name')
      .addSelect('COUNT(*)', 'play_count')
      .groupBy('play_history.game_name')
      .orderBy('play_count', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      game_name: item.game_name,
      play_count: parseInt(item.play_count),
    }));
  }
}
