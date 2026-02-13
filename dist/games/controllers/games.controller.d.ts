import { GamesService } from '../services/games.service';
import { PlaySessionDto, PlaySessionResponseDto } from '../dto/play-session.dto';
import { GameHistoryFilterDto, GameHistoryDto, GameHistoryResponseDto, GameStatsDto } from '../dto/game-history.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    recordPlaySession(user: AuthenticatedUser, playSessionDto: PlaySessionDto): Promise<PlaySessionResponseDto>;
    getGameHistory(user: AuthenticatedUser, filters: GameHistoryFilterDto): Promise<GameHistoryResponseDto>;
    getGameSessionById(user: AuthenticatedUser, sessionId: number): Promise<GameHistoryDto>;
    getGameStats(user: AuthenticatedUser): Promise<GameStatsDto>;
    getPopularGames(limit?: string): Promise<Array<{
        game_name: string;
        play_count: number;
    }>>;
}
