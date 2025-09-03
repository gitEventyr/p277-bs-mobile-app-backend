import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CasinoAction } from '../../entities/casino-action.entity';

@Injectable()
export class CasinoActionService {
  constructor(
    @InjectRepository(CasinoAction)
    private casinoActionRepository: Repository<CasinoAction>,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    search: string;
    casinoName?: string | null;
    registration?: string;
    deposit?: string;
    sortBy: string;
  }) {
    const { page, limit, search, casinoName, registration, deposit, sortBy } =
      options;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    // Search by visitor_id
    if (search) {
      whereConditions.visitor_id = Like(`%${search}%`);
    }

    // Filter by casino name
    if (casinoName) {
      whereConditions.casino_name = casinoName;
    }

    // Filter by registration
    if (registration === 'true') {
      whereConditions.registration = true;
    } else if (registration === 'false') {
      whereConditions.registration = false;
    }

    // Filter by deposit
    if (deposit === 'true') {
      whereConditions.deposit = true;
    } else if (deposit === 'false') {
      whereConditions.deposit = false;
    }

    const order: any = {};
    order[sortBy] = 'DESC';

    const [data, total] = await this.casinoActionRepository.findAndCount({
      where: whereConditions,
      order,
      skip,
      take: limit,
      relations: ['casino', 'player'],
    });

    const totalPages = Math.ceil(total / limit);
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    const pages: Array<{ number: number; active: boolean }> = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        number: i,
        active: i === page,
      });
    }

    return {
      data,
      pagination: {
        total,
        from,
        to,
        currentPage: page,
        totalPages,
        hasPages: totalPages > 1,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        pages,
      },
    };
  }

  async findById(id: number): Promise<CasinoAction | null> {
    return await this.casinoActionRepository.findOne({
      where: { id },
      relations: ['casino', 'player'],
    });
  }

  async create(createData: {
    casino_name: string;
    date_of_action: Date;
    visitor_id: string;
    registration: boolean;
    deposit: boolean;
  }): Promise<CasinoAction> {
    const casinoAction = this.casinoActionRepository.create(createData);
    return await this.casinoActionRepository.save(casinoAction);
  }

  async update(
    id: number,
    updateData: Partial<{
      casino_name: string;
      date_of_action: Date;
      visitor_id: string;
      registration: boolean;
      deposit: boolean;
    }>,
  ): Promise<CasinoAction> {
    await this.casinoActionRepository.update(id, updateData);
    const casinoAction = await this.findById(id);
    if (!casinoAction) {
      throw new Error('Casino action not found after update');
    }
    return casinoAction;
  }

  async delete(id: number): Promise<void> {
    await this.casinoActionRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.casinoActionRepository.count();
  }

  async countByCasino(casinoName: string): Promise<number> {
    return await this.casinoActionRepository.count({
      where: { casino_name: casinoName },
    });
  }

  async countByType(type: 'registration' | 'deposit'): Promise<number> {
    const where =
      type === 'registration' ? { registration: true } : { deposit: true };
    return await this.casinoActionRepository.count({ where });
  }
}
