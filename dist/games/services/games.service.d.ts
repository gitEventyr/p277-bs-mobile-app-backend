import { Repository } from 'typeorm';
import { PlayHistory } from '../../entities/play-history.entity';
import { Player } from '../../entities/player.entity';
import { BalanceService } from '../../users/services/balance.service';
import { PlaySessionDto, PlaySessionResponseDto } from '../dto/play-session.dto';
import { GameHistoryFilterDto, GameHistoryDto, GameHistoryResponseDto, GameStatsDto } from '../dto/game-history.dto';
export declare class GamesService {
    private readonly playHistoryRepository;
    private readonly playerRepository;
    private readonly balanceService;
    private readonly logger;
    constructor(playHistoryRepository: Repository<PlayHistory>, playerRepository: Repository<Player>, balanceService: BalanceService);
    recordGameSession(userId: number, playSessionDto: PlaySessionDto): Promise<PlaySessionResponseDto>;
    getGameHistory(userId: number, filters: GameHistoryFilterDto): Promise<GameHistoryResponseDto>;
    getGameSessionById(userId: number, sessionId: number): Promise<GameHistoryDto>;
    getGameStats(userId: number): Promise<GameStatsDto>;
    private validateGameSession;
    getTotalGameSessions(): Promise<number>;
    getTotalGameRevenue(): Promise<number>;
    getPopularGames(limit?: number): Promise<Array<{
        game_name: string;
        play_count: number;
    }>>;
}
