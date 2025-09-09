"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GamesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const play_history_entity_1 = require("../../entities/play-history.entity");
const player_entity_1 = require("../../entities/player.entity");
const balance_service_1 = require("../../users/services/balance.service");
let GamesService = GamesService_1 = class GamesService {
    playHistoryRepository;
    playerRepository;
    balanceService;
    logger = new common_1.Logger(GamesService_1.name);
    constructor(playHistoryRepository, playerRepository, balanceService) {
        this.playHistoryRepository = playHistoryRepository;
        this.playerRepository = playerRepository;
        this.balanceService = balanceService;
    }
    async recordGameSession(userId, playSessionDto) {
        this.logger.log(`Recording game session for analytics (no balance change) for user ${userId}: ${playSessionDto.game_name}`);
        this.validateGameSession(playSessionDto);
        const netResult = playSessionDto.won - playSessionDto.lost;
        const gameSession = this.playHistoryRepository.create({
            user_id: userId,
            bet: playSessionDto.bet,
            won: playSessionDto.won,
            lost: playSessionDto.lost,
            game_name: playSessionDto.game_name,
        });
        const savedSession = await this.playHistoryRepository.save(gameSession);
        this.logger.log(`Game session ${savedSession.id} created for analytics tracking for user ${userId} - balance unchanged`);
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
            balance_change: null,
        };
    }
    async getGameHistory(userId, filters) {
        const { page = 1, limit = 10, game_name, sort_by = 'created_at', sort_order = 'desc', } = filters;
        const skip = (page - 1) * limit;
        let queryBuilder = this.playHistoryRepository
            .createQueryBuilder('play_history')
            .where('play_history.user_id = :userId', { userId });
        if (game_name) {
            queryBuilder = queryBuilder.andWhere('play_history.game_name ILIKE :gameName', {
                gameName: `%${game_name}%`,
            });
        }
        const sortField = `play_history.${sort_by}`;
        queryBuilder = queryBuilder.orderBy(sortField, sort_order.toUpperCase());
        const total = await queryBuilder.getCount();
        const sessions = await queryBuilder.skip(skip).take(limit).getMany();
        const sessionHistory = sessions.map((session) => ({
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
    async getGameSessionById(userId, sessionId) {
        const session = await this.playHistoryRepository.findOne({
            where: { id: sessionId, user_id: userId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Game session not found');
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
    async getGameStats(userId) {
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
        const totalBet = sessions.reduce((sum, session) => sum + session.bet, 0);
        const totalWon = sessions.reduce((sum, session) => sum + session.won, 0);
        const totalLost = sessions.reduce((sum, session) => sum + session.lost, 0);
        const netResult = totalWon - totalLost;
        const rtpPercentage = totalBet > 0 ? totalWon / totalBet : 0;
        const gameBreakdown = {};
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
            rtp_percentage: Math.round(rtpPercentage * 10000) / 100,
            average_bet: totalBet / sessions.length,
            average_won: totalWon / sessions.length,
            games_played: gamesPlayed,
            game_breakdown: gameBreakdown,
            last_session: lastSession.created_at,
            first_session: firstSession.created_at,
        };
    }
    validateGameSession(playSessionDto) {
        const { bet, won, lost } = playSessionDto;
        if (bet < 0 || won < 0 || lost < 0) {
            throw new common_1.BadRequestException('Bet, won, and lost amounts must be non-negative');
        }
        if (bet === 0 && (won > 0 || lost > 0)) {
            throw new common_1.BadRequestException('Cannot have wins or losses without a bet');
        }
        const totalPayout = won + lost;
        if (totalPayout > bet * 10) {
            throw new common_1.BadRequestException('Win/loss amounts seem unrealistic compared to bet amount');
        }
        if (!playSessionDto.game_name ||
            playSessionDto.game_name.trim().length === 0) {
            throw new common_1.BadRequestException('Game name is required');
        }
        this.logger.log(`Game session validation passed: bet=${bet}, won=${won}, lost=${lost}, game=${playSessionDto.game_name}`);
    }
    async getTotalGameSessions() {
        return await this.playHistoryRepository.count();
    }
    async getTotalGameRevenue() {
        const result = await this.playHistoryRepository
            .createQueryBuilder('play_history')
            .select('SUM(play_history.lost) - SUM(play_history.won)', 'revenue')
            .getRawOne();
        return parseFloat(result?.revenue || '0');
    }
    async getPopularGames(limit = 10) {
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
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = GamesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(play_history_entity_1.PlayHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        balance_service_1.BalanceService])
], GamesService);
//# sourceMappingURL=games.service.js.map