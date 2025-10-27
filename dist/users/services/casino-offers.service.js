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
var CasinoOffersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoOffersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../../entities/player.entity");
const casino_action_entity_1 = require("../../entities/casino-action.entity");
const casino_entity_1 = require("../../entities/casino.entity");
const casino_api_service_1 = require("../../external/casino/casino-api.service");
let CasinoOffersService = CasinoOffersService_1 = class CasinoOffersService {
    playerRepository;
    casinoActionRepository;
    casinoRepository;
    casinoApiService;
    logger = new common_1.Logger(CasinoOffersService_1.name);
    constructor(playerRepository, casinoActionRepository, casinoRepository, casinoApiService) {
        this.playerRepository = playerRepository;
        this.casinoActionRepository = casinoActionRepository;
        this.casinoRepository = casinoRepository;
        this.casinoApiService = casinoApiService;
    }
    async getCasinoOffers(userId, ipAddress) {
        const user = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!user.visitor_id) {
            throw new common_1.BadRequestException('User visitor_id not found');
        }
        const userDepositActions = await this.casinoActionRepository.find({
            where: {
                visitor_id: user.visitor_id,
                deposit: true,
            },
            relations: ['casino'],
        });
        this.logger.debug(`Found ${userDepositActions.length} deposit actions for user ${userId}`);
        const excludeCasinoIds = [];
        for (const action of userDepositActions) {
            const casino = await this.casinoRepository.findOne({
                where: { casino_name: action.casino_name },
            });
            if (casino && casino.casino_id) {
                const casinoIdNumber = parseInt(casino.casino_id);
                if (!isNaN(casinoIdNumber) &&
                    !excludeCasinoIds.includes(casinoIdNumber)) {
                    excludeCasinoIds.push(casinoIdNumber);
                }
            }
        }
        this.logger.debug(`Excluding casino IDs: [${excludeCasinoIds.join(', ')}] for user ${userId}`);
        const excludeIds = excludeCasinoIds.length > 0 ? excludeCasinoIds : null;
        try {
            const offers = await this.casinoApiService.getOffers(ipAddress, user.visitor_id, excludeIds);
            this.logger.log(`Retrieved ${offers.length} casino offers for user ${userId}`);
            return offers;
        }
        catch (error) {
            this.logger.error('Failed to fetch casino offers', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                visitorId: user.visitor_id,
                excludeIds,
            });
            throw error;
        }
    }
};
exports.CasinoOffersService = CasinoOffersService;
exports.CasinoOffersService = CasinoOffersService = CasinoOffersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(casino_action_entity_1.CasinoAction)),
    __param(2, (0, typeorm_1.InjectRepository)(casino_entity_1.Casino)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        casino_api_service_1.CasinoApiService])
], CasinoOffersService);
//# sourceMappingURL=casino-offers.service.js.map