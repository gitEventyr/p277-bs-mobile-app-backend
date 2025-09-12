import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { CasinoAction } from '../../entities/casino-action.entity';
import { Casino } from '../../entities/casino.entity';
import { CasinoApiService } from '../../external/casino/casino-api.service';
import { CasinoOfferDto } from '../dto/casino-offers.dto';

@Injectable()
export class CasinoOffersService {
  private readonly logger = new Logger(CasinoOffersService.name);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(CasinoAction)
    private readonly casinoActionRepository: Repository<CasinoAction>,
    @InjectRepository(Casino)
    private readonly casinoRepository: Repository<Casino>,
    private readonly casinoApiService: CasinoApiService,
  ) {}

  async getCasinoOffers(
    userId: number,
    ipAddress: string,
  ): Promise<CasinoOfferDto[]> {
    // Step 1: Get user and their visitor_id
    const user = await this.playerRepository.findOne({
      where: { id: userId, is_deleted: false },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.visitor_id) {
      throw new BadRequestException('User visitor_id not found');
    }

    // Step 2: Find all casino actions where user made deposits
    const userDepositActions = await this.casinoActionRepository.find({
      where: {
        visitor_id: user.visitor_id,
        deposit: true,
      },
      relations: ['casino'],
    });

    this.logger.debug(
      `Found ${userDepositActions.length} deposit actions for user ${userId}`,
    );

    // Step 3: Extract unique casino_id values from casinos where user made deposits
    const excludeCasinoIds: number[] = [];

    for (const action of userDepositActions) {
      // Try to find the casino by name to get the casino_id
      const casino = await this.casinoRepository.findOne({
        where: { casino_name: action.casino_name },
      });

      if (casino && casino.casino_id) {
        const casinoIdNumber = parseInt(casino.casino_id);
        if (
          !isNaN(casinoIdNumber) &&
          !excludeCasinoIds.includes(casinoIdNumber)
        ) {
          excludeCasinoIds.push(casinoIdNumber);
        }
      }
    }

    this.logger.debug(
      `Excluding casino IDs: [${excludeCasinoIds.join(', ')}] for user ${userId}`,
    );

    // Step 4: Call external API to get offers
    const excludeIds = excludeCasinoIds.length > 0 ? excludeCasinoIds : null;

    try {
      const offers = await this.casinoApiService.getOffers(
        ipAddress,
        user.visitor_id,
        excludeIds,
      );

      this.logger.log(
        `Retrieved ${offers.length} casino offers for user ${userId}`,
      );

      return offers;
    } catch (error) {
      this.logger.error('Failed to fetch casino offers', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        visitorId: user.visitor_id,
        excludeIds,
      });
      throw error;
    }
  }
}
