import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Casino } from '../../entities/casino.entity';

@Injectable()
export class CasinoService {
  constructor(
    @InjectRepository(Casino)
    private casinoRepository: Repository<Casino>,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    actionsCount?: string;
  }) {
    const { page, limit, search, sortBy, actionsCount } = options;
    const skip = (page - 1) * limit;

    let query = this.casinoRepository
      .createQueryBuilder('casino')
      .leftJoinAndSelect('casino.actions', 'actions');

    // Search by casino name or casino_id
    if (search) {
      query = query.andWhere(
        '(casino.casino_name ILIKE :search OR casino.casino_id ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by actions count
    if (actionsCount) {
      if (actionsCount === '0') {
        query = query.andWhere(
          '(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) = 0',
        );
      } else if (actionsCount === '1-10') {
        query = query.andWhere(
          '(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) BETWEEN 1 AND 10',
        );
      } else if (actionsCount === '11-50') {
        query = query.andWhere(
          '(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) BETWEEN 11 AND 50',
        );
      } else if (actionsCount === '51+') {
        query = query.andWhere(
          '(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) > 50',
        );
      }
    }

    // Sorting
    let sortByActionsCount = false;
    if (sortBy === 'casino_name') {
      query = query.orderBy('casino.casino_name', 'ASC');
    } else if (sortBy === 'actions_count_desc') {
      sortByActionsCount = true;
      query = query
        .loadRelationCountAndMap('casino.actionsCount', 'casino.actions')
        .orderBy(
          '(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id)',
          'DESC',
        );
    } else if (sortBy === 'actions_count_asc') {
      sortByActionsCount = true;
      query = query
        .loadRelationCountAndMap('casino.actionsCount', 'casino.actions')
        .orderBy(
          '(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id)',
          'ASC',
        );
    } else {
      query = query.orderBy('casino.created_at', 'DESC');
    }

    // Get total count
    const total = await query.getCount();

    // Apply pagination
    const data = await query.skip(skip).take(limit).getMany();

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

  async findById(id: number): Promise<Casino | null> {
    return await this.casinoRepository.findOne({
      where: { id },
      relations: ['actions'],
    });
  }

  async findByName(casino_name: string): Promise<Casino | null> {
    return await this.casinoRepository.findOne({
      where: { casino_name },
    });
  }

  async create(createData: {
    casino_name: string;
    casino_id?: string;
  }): Promise<Casino> {
    const casino = this.casinoRepository.create(createData);
    return await this.casinoRepository.save(casino);
  }

  async update(
    id: number,
    updateData: { casino_name: string; casino_id?: string },
  ): Promise<Casino> {
    await this.casinoRepository.update(id, updateData);
    const casino = await this.findById(id);
    if (!casino) {
      throw new Error('Casino not found after update');
    }
    return casino;
  }

  async delete(id: number): Promise<void> {
    await this.casinoRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.casinoRepository.count();
  }

  async findAllForSync(): Promise<Casino[]> {
    return await this.casinoRepository.find();
  }

  async updateCasinoId(id: number, casino_id: string): Promise<void> {
    await this.casinoRepository.update(id, { casino_id });
  }
}
