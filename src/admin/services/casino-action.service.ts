import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CasinoAction } from '../../entities/casino-action.entity';
import { Casino } from '../../entities/casino.entity';
import { Player } from '../../entities/player.entity';

@Injectable()
export class CasinoActionService {
  constructor(
    @InjectRepository(CasinoAction)
    private casinoActionRepository: Repository<CasinoAction>,
    @InjectRepository(Casino)
    private casinoRepository: Repository<Casino>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
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

  // CSV Bulk Upload Methods
  async bulkCreateFromCSV(
    csvContent: string,
    options: {
      skipErrors?: boolean;
      createMissingCasinos?: boolean;
      createMissingPlayers?: boolean;
    },
  ) {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new BadRequestException(
        'CSV file must contain headers and at least one data row',
      );
    }

    // Parse headers
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const expectedHeaders = [
      'casino_name',
      'visitor_id',
      'date_of_action',
      'registration',
      'deposit',
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new BadRequestException(
        `Missing required headers: ${missingHeaders.join(', ')}`,
      );
    }

    const results = {
      totalRows: lines.length - 1,
      successfulRows: 0,
      errorRows: 0,
      errors: [] as Array<{ row: number; message: string }>,
      createdCasinos: 0,
      createdPlayers: 0,
    };

    const createdCasinoNames = new Set<string>();
    const createdPlayerIds = new Set<string>();

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const rowData = this.parseCSVRow(lines[i]);
        if (rowData.length !== headers.length) {
          throw new Error(
            `Row has ${rowData.length} columns but expected ${headers.length}`,
          );
        }

        // Create row object
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = rowData[index];
        });

        // Validate and parse the row data
        const casinoActionData = await this.validateAndParseCSVRow(row, i + 1);

        // Ensure casino exists (create if needed and option is enabled)
        if (options.createMissingCasinos) {
          const existingCasino = await this.casinoRepository.findOne({
            where: { casino_name: casinoActionData.casino_name },
          });

          if (
            !existingCasino &&
            !createdCasinoNames.has(casinoActionData.casino_name)
          ) {
            await this.casinoRepository.save({
              casino_name: casinoActionData.casino_name,
            });
            createdCasinoNames.add(casinoActionData.casino_name);
            results.createdCasinos++;
          }
        }

        // Ensure player exists (create if needed and option is enabled)
        let playerExists = false;
        if (options.createMissingPlayers) {
          const existingPlayer = await this.playerRepository.findOne({
            where: { visitor_id: casinoActionData.visitor_id },
          });

          if (
            !existingPlayer &&
            !createdPlayerIds.has(casinoActionData.visitor_id)
          ) {
            await this.playerRepository.save({
              visitor_id: casinoActionData.visitor_id,
            });
            createdPlayerIds.add(casinoActionData.visitor_id);
            results.createdPlayers++;
            playerExists = true;
          } else if (
            existingPlayer ||
            createdPlayerIds.has(casinoActionData.visitor_id)
          ) {
            playerExists = true;
          }
        } else {
          // Check if player exists when not creating missing players
          const existingPlayer = await this.playerRepository.findOne({
            where: { visitor_id: casinoActionData.visitor_id },
          });
          playerExists = !!existingPlayer;
        }

        // Only create casino action if player exists (to avoid foreign key constraint violation)
        if (!playerExists) {
          throw new Error(
            `Player with visitor_id '${casinoActionData.visitor_id}' does not exist`,
          );
        }

        // Create the casino action
        await this.create(casinoActionData);
        results.successfulRows++;
      } catch (error) {
        results.errorRows++;
        results.errors.push({
          row: i + 1,
          message: error.message,
        });

        if (!options.skipErrors) {
          throw new BadRequestException(
            `Error on row ${i + 1}: ${error.message}`,
          );
        }
      }
    }

    return results;
  }

  private parseCSVRow(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());
    return result;
  }

  private async validateAndParseCSVRow(
    row: any,
    rowNumber: number,
  ): Promise<{
    casino_name: string;
    visitor_id: string;
    date_of_action: Date;
    registration: boolean;
    deposit: boolean;
  }> {
    // Validate casino_name
    if (!row.casino_name || row.casino_name.trim() === '') {
      throw new Error('casino_name is required');
    }

    // Validate visitor_id
    if (!row.visitor_id || row.visitor_id.trim() === '') {
      throw new Error('visitor_id is required');
    }

    // Parse and validate date_of_action
    let dateOfAction: Date;
    try {
      dateOfAction = new Date(row.date_of_action);
      if (isNaN(dateOfAction.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      throw new Error(
        'date_of_action must be a valid date (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)',
      );
    }

    // Parse registration boolean
    const registration = this.parseBoolean(row.registration, 'registration');

    // Parse deposit boolean
    const deposit = this.parseBoolean(row.deposit, 'deposit');

    return {
      casino_name: row.casino_name.trim(),
      visitor_id: row.visitor_id.trim(),
      date_of_action: dateOfAction,
      registration,
      deposit,
    };
  }

  private parseBoolean(value: any, fieldName: string): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
        return true;
      }
      if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
        return false;
      }
    }

    throw new Error(
      `${fieldName} must be a boolean value (true/false, 1/0, yes/no)`,
    );
  }
}
