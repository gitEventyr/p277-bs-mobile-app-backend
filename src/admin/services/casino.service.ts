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
  }) {
    const { page, limit, search, sortBy } = options;
    const skip = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        casino_name: Like(`%${search}%`),
      };
    }

    const order: any = {};
    order[sortBy] = 'DESC';

    const [data, total] = await this.casinoRepository.findAndCount({
      where: whereCondition,
      order,
      skip,
      take: limit,
      relations: ['actions'],
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

  async create(createData: { casino_name: string }): Promise<Casino> {
    const casino = this.casinoRepository.create(createData);
    return await this.casinoRepository.save(casino);
  }

  async update(
    id: number,
    updateData: { casino_name: string },
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
}
