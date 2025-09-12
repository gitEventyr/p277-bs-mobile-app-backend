import { Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { CasinoAction } from '../../entities/casino-action.entity';
import { Casino } from '../../entities/casino.entity';
import { CasinoApiService } from '../../external/casino/casino-api.service';
import { CasinoOfferDto } from '../dto/casino-offers.dto';
export declare class CasinoOffersService {
    private readonly playerRepository;
    private readonly casinoActionRepository;
    private readonly casinoRepository;
    private readonly casinoApiService;
    private readonly logger;
    constructor(playerRepository: Repository<Player>, casinoActionRepository: Repository<CasinoAction>, casinoRepository: Repository<Casino>, casinoApiService: CasinoApiService);
    getCasinoOffers(userId: number, ipAddress: string): Promise<CasinoOfferDto[]>;
}
