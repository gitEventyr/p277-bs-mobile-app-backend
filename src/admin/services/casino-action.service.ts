import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CasinoAction } from '../../entities/casino-action.entity';
import { Casino } from '../../entities/casino.entity';
import { Player } from '../../entities/player.entity';
import { CasinoApiService } from '../../external/casino/casino-api.service';
import { RpBalanceService } from '../../users/services/rp-balance.service';
import { OneSignalService } from '../../external/onesignal/onesignal.service';

@Injectable()
export class CasinoActionService {
  private readonly logger = new Logger(CasinoActionService.name);

  constructor(
    @InjectRepository(CasinoAction)
    private casinoActionRepository: Repository<CasinoAction>,
    @InjectRepository(Casino)
    private casinoRepository: Repository<Casino>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private readonly casinoApiService: CasinoApiService,
    private readonly rpBalanceService: RpBalanceService,
    private readonly oneSignalService: OneSignalService,
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

    // Transform data to handle deleted users
    const transformedData = data.map((action) => {
      const isDeleted = action.visitor_id.includes('_deleted_');
      const originalVisitorId = isDeleted
        ? action.visitor_id.replace(/_deleted_\d+$/, '')
        : action.visitor_id;

      return {
        ...action,
        visitor_id: originalVisitorId,
        player: action.player
          ? {
              ...action.player,
              name: isDeleted ? 'DELETED' : action.player.name,
            }
          : null,
        is_user_deleted: isDeleted,
      };
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
      data: transformedData,
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

  async findById(id: number): Promise<any> {
    const action = await this.casinoActionRepository.findOne({
      where: { id },
      relations: ['casino', 'player'],
    });

    if (!action) {
      return null;
    }

    // Transform data to handle deleted users
    const isDeleted = action.visitor_id.includes('_deleted_');
    const originalVisitorId = isDeleted
      ? action.visitor_id.replace(/_deleted_\d+$/, '')
      : action.visitor_id;

    return {
      ...action,
      visitor_id: originalVisitorId,
      player: action.player
        ? {
            ...action.player,
            name: isDeleted ? 'DELETED' : action.player.name,
          }
        : null,
      is_user_deleted: isDeleted,
    };
  }

  async create(createData: {
    casino_name: string;
    date_of_action: Date;
    visitor_id: string;
    registration: boolean;
    deposit: boolean;
  }): Promise<CasinoAction> {
    const casinoAction = this.casinoActionRepository.create(createData);
    const savedCasinoAction =
      await this.casinoActionRepository.save(casinoAction);

    // Process RP rewards after saving the casino action
    await this.processRpRewards(createData);

    // Send OneSignal tags for casino action
    await this.sendCasinoActionTags(createData);

    return savedCasinoAction;
  }

  /**
   * Process RP rewards for casino actions
   * - Registration: 100 RP per new casino (one-time per user per casino)
   * - First Deposit: 2000 RP for user's very first deposit across all casinos
   * - Subsequent Deposits: 1000 RP per casino (one-time per user per casino)
   */
  private async processRpRewards(actionData: {
    casino_name: string;
    visitor_id: string;
    registration: boolean;
    deposit: boolean;
  }): Promise<void> {
    try {
      // Find the user by visitor_id
      const user = await this.playerRepository.findOne({
        where: { visitor_id: actionData.visitor_id, is_deleted: false },
      });

      if (!user) {
        this.logger.warn(
          `User not found for visitor_id: ${actionData.visitor_id}`,
        );
        return;
      }

      // Process registration rewards
      if (actionData.registration) {
        await this.processRegistrationReward(user.id, actionData.casino_name);
      }

      // Process deposit rewards
      if (actionData.deposit) {
        await this.processDepositReward(user.id, actionData.casino_name);
      }
    } catch (error) {
      this.logger.error(
        `Failed to process RP rewards for casino action: ${error.message}`,
        error.stack,
      );
      // Don't throw error to prevent casino action creation from failing
    }
  }

  /**
   * Award 100 RP for registration at a new casino (one-time per user per casino)
   */
  private async processRegistrationReward(
    userId: number,
    casinoName: string,
  ): Promise<void> {
    const user = await this.playerRepository.findOne({ where: { id: userId } });
    if (!user) return;

    // Check if user has already had registration actions for this casino
    const registrationCount = await this.casinoActionRepository.count({
      where: {
        visitor_id: user.visitor_id,
        casino_name: casinoName,
        registration: true,
      },
    });

    // Only award if this is the first registration action for this user at this casino
    if (registrationCount > 1) {
      this.logger.log(
        `User ${userId} already received registration reward for casino ${casinoName}`,
      );
      return;
    }

    // Award registration RP
    try {
      await this.rpBalanceService.modifyRpBalance(userId, {
        amount: 100,
        reason: `Registration at ${casinoName} casino`,
      });

      this.logger.log(
        `Awarded 100 RP to user ${userId} for registration at ${casinoName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to award registration RP to user ${userId}: ${error.message}`,
      );
    }
  }

  /**
   * Award RP for deposits:
   * - 2000 RP for user's first deposit across all casinos
   * - 1000 RP for first deposit at each subsequent casino (one-time per user per casino)
   */
  private async processDepositReward(
    userId: number,
    casinoName: string,
  ): Promise<void> {
    const user = await this.playerRepository.findOne({ where: { id: userId } });
    if (!user) return;

    // Check if user has had any deposit actions before
    const totalDepositCount = await this.casinoActionRepository.count({
      where: {
        visitor_id: user.visitor_id,
        deposit: true,
      },
    });

    // Check if user has had deposit actions at this specific casino before
    const casinoDepositCount = await this.casinoActionRepository.count({
      where: {
        visitor_id: user.visitor_id,
        casino_name: casinoName,
        deposit: true,
      },
    });

    // If this is the user's very first deposit across all casinos
    if (totalDepositCount === 1) {
      try {
        await this.rpBalanceService.modifyRpBalance(userId, {
          amount: 2000,
          reason: `First deposit reward (${casinoName})`,
        });

        this.logger.log(
          `Awarded 2000 RP to user ${userId} for first deposit at ${casinoName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to award first deposit RP to user ${userId}: ${error.message}`,
        );
      }
    }
    // If this is the first deposit at this casino (but not user's first deposit overall)
    else if (casinoDepositCount === 1) {
      try {
        await this.rpBalanceService.modifyRpBalance(userId, {
          amount: 1000,
          reason: `First deposit at ${casinoName}`,
        });

        this.logger.log(
          `Awarded 1000 RP to user ${userId} for first deposit at ${casinoName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to award casino deposit RP to user ${userId}: ${error.message}`,
        );
      }
    } else {
      this.logger.log(
        `User ${userId} already received deposit reward for casino ${casinoName}`,
      );
    }
  }

  /**
   * Send OneSignal tags for casino actions (registrations and deposits)
   * Handles tags for 1st, 2nd registration, FTD, 2nd deposit, and 3rd+ registrations
   */
  private async sendCasinoActionTags(actionData: {
    casino_name: string;
    visitor_id: string;
    date_of_action: Date;
    registration: boolean;
    deposit: boolean;
  }): Promise<void> {
    try {
      // Find the user by visitor_id
      const user = await this.playerRepository.findOne({
        where: { visitor_id: actionData.visitor_id, is_deleted: false },
      });

      if (!user || !user.visitor_id) {
        this.logger.warn(
          `Cannot send casino action tags: user not found for visitor_id ${actionData.visitor_id}`,
        );
        return;
      }

      const tags: Record<string, string> = {};
      const actionDateISO = actionData.date_of_action.toISOString();

      // Process registration tags
      if (actionData.registration) {
        // Count total unique casino registrations for this user
        const uniqueRegistrations = await this.casinoActionRepository
          .createQueryBuilder('action')
          .select('DISTINCT action.casino_name')
          .where('action.visitor_id = :visitorId', {
            visitorId: actionData.visitor_id,
          })
          .andWhere('action.registration = :registration', {
            registration: true,
          })
          .getRawMany();

        const registrationCount = uniqueRegistrations.length;

        if (registrationCount === 1) {
          // First registration
          tags['first_reg_casino_date'] = actionDateISO;
          tags['first_reg_casino_name'] = actionData.casino_name;
        } else if (registrationCount === 2) {
          // Second registration
          tags['second_reg_casino_date'] = actionDateISO;
          tags['second_reg_casino_name'] = actionData.casino_name;
        } else if (registrationCount >= 3) {
          // Third+ registration (only send casino name)
          tags[`${registrationCount}_reg_casino_name`] = actionData.casino_name;
        }
      }

      // Process deposit tags
      if (actionData.deposit) {
        // Count total deposits for this user across all casinos
        const totalDeposits = await this.casinoActionRepository.count({
          where: {
            visitor_id: actionData.visitor_id,
            deposit: true,
          },
        });

        if (totalDeposits === 1) {
          // First deposit (FTD)
          tags['ftd_casino_date'] = actionDateISO;
          tags['ftd_casino_name'] = actionData.casino_name;
        } else if (totalDeposits === 2) {
          // Second deposit
          tags['second_deposit_casino_date'] = actionDateISO;
          tags['second_deposit_casino_name'] = actionData.casino_name;
        }
      }

      // Send tags if we have any
      if (Object.keys(tags).length > 0) {
        this.logger.log(
          `Sending casino action tags for visitor ${actionData.visitor_id}: ${Object.keys(tags).join(', ')}`,
        );

        await this.oneSignalService.updateUserTags(user.visitor_id, tags);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send casino action tags for visitor ${actionData.visitor_id}`,
        error,
      );
    }
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

    // Parse headers (support both comma and semicolon separators)
    const separator = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0]
      .split(separator)
      .map((h) => h.trim().replace(/"/g, ''));
    const expectedHeaders = [
      'casino_name',
      'date_casino',
      'click_id_casino',
      'reg_casino',
      'ftd_casino',
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
      skippedRows: 0,
      errors: [] as Array<{ row: number; message: string }>,
      createdCasinos: 0,
      createdPlayers: 0,
    };

    const createdCasinoNames = new Set<string>();
    const createdPlayerIds = new Set<string>();

    // Cache for external casinos to avoid multiple API calls
    let externalCasinos: Array<{ id: number; admin_name: string }> | null =
      null;
    const fetchExternalCasinos = async () => {
      if (externalCasinos === null && this.casinoApiService.isConfigured()) {
        try {
          externalCasinos = await this.casinoApiService.getCasinos();
        } catch (error) {
          console.warn('Failed to fetch external casinos:', error.message);
          externalCasinos = []; // Set to empty array to avoid retrying
        }
      }
      return externalCasinos || [];
    };

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const rowData = this.parseCSVRow(lines[i], separator);
        if (rowData.length !== headers.length) {
          throw new Error(
            `Row has ${rowData.length} columns but expected ${headers.length}`,
          );
        }

        // Create row object with column mapping
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = rowData[index];
        });

        // Map new column names to internal field names
        const mappedRow = {
          casino_name: row.casino_name,
          date_of_action: row.date_casino,
          visitor_id: row.click_id_casino,
          registration: row.reg_casino,
          deposit: row.ftd_casino,
        };

        // Validate and parse the row data
        const casinoActionData = await this.validateAndParseCSVRow(
          mappedRow,
          i + 1,
        );

        // Enhanced casino lookup: check both by name and casino_id to prevent duplicates
        let existingCasino = await this.casinoRepository.findOne({
          where: { casino_name: casinoActionData.casino_name },
        });

        if (
          !existingCasino &&
          !createdCasinoNames.has(casinoActionData.casino_name)
        ) {
          if (options.createMissingCasinos) {
            // First, try to find the casino in external API
            const externalCasinosList = await fetchExternalCasinos();
            const matchingExternalCasino = externalCasinosList.find(
              (external) => {
                // First try exact match
                if (external.admin_name === casinoActionData.casino_name) {
                  return true;
                }

                // Try case-insensitive match
                if (
                  external.admin_name.toLowerCase() ===
                  casinoActionData.casino_name.toLowerCase()
                ) {
                  return true;
                }

                // Try normalized match (remove special chars, extra spaces, and common suffixes)
                const normalizeString = (str: string) => {
                  return str
                    .toLowerCase()
                    .replace(/[–-]/g, '-') // normalize different dash types
                    .replace(/\s*–\s*bns!?/gi, '') // remove " – BNS" or " – BNS!" suffixes
                    .replace(/\s*-\s*bns!?/gi, '') // remove " - BNS" or " - BNS!" suffixes
                    .replace(/\s*bns!?$/gi, '') // remove "BNS" or "BNS!" at the end
                    .replace(/\s*-\s*(fr|ca|en)\s*$/gi, '') // remove language codes like " - FR", " - CA"
                    .replace(/\s+/g, ' ') // normalize multiple spaces to single space
                    .trim();
                };

                const normalizedExternal = normalizeString(external.admin_name);
                const normalizedCsv = normalizeString(
                  casinoActionData.casino_name,
                );

                // Check if normalized strings match
                if (normalizedExternal === normalizedCsv) {
                  return true;
                }

                // Check if one contains the other (for partial matches)
                if (
                  normalizedExternal.includes(normalizedCsv) ||
                  normalizedCsv.includes(normalizedExternal)
                ) {
                  // Only match if the shorter string is at least 5 characters to avoid false positives
                  const shorterLength = Math.min(
                    normalizedExternal.length,
                    normalizedCsv.length,
                  );
                  return shorterLength >= 5;
                }

                return false;
              },
            );

            if (matchingExternalCasino) {
              // Double-check: ensure no casino already exists with this casino_id to prevent duplicates
              const duplicateByExternalId = await this.casinoRepository.findOne(
                {
                  where: { casino_id: matchingExternalCasino.id.toString() },
                },
              );

              if (duplicateByExternalId) {
                console.log(
                  `✓ Found existing casino with casino_id '${matchingExternalCasino.id}': '${duplicateByExternalId.casino_name}'. Using existing casino for CSV name '${casinoActionData.casino_name}'.`,
                );
                existingCasino = duplicateByExternalId;
              } else {
                // Create casino with external ID using the EXTERNAL API name to ensure consistency
                existingCasino = await this.casinoRepository.save({
                  casino_name: matchingExternalCasino.admin_name, // Use external name, not CSV name
                  casino_id: matchingExternalCasino.id.toString(),
                });
                createdCasinoNames.add(matchingExternalCasino.admin_name); // Track by external name
                results.createdCasinos++;
                console.log(
                  `✓ Created new casino '${matchingExternalCasino.admin_name}' (was '${casinoActionData.casino_name}' in CSV) with external ID: ${matchingExternalCasino.id}`,
                );
              }
            } else {
              // Log available external casinos for debugging
              console.log(
                `✗ No match found for '${casinoActionData.casino_name}'`,
              );
              console.log(
                `Available external casinos: ${externalCasinosList
                  .slice(0, 10)
                  .map((c) => `'${c.admin_name}'`)
                  .join(
                    ', ',
                  )}${externalCasinosList.length > 10 ? ` ... (and ${externalCasinosList.length - 10} more)` : ''}`,
              );

              // Casino not found in external API, skip this casino action
              throw new Error(
                `Casino '${casinoActionData.casino_name}' not found in internal system or external API`,
              );
            }
          } else {
            // createMissingCasinos is disabled, throw error
            throw new Error(
              `Casino '${casinoActionData.casino_name}' does not exist`,
            );
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

        // Create the casino action using the consistent casino name from database
        const finalActionData = {
          ...casinoActionData,
          casino_name: existingCasino!.casino_name, // Use the actual casino name from database, not CSV
        };

        const createdAction =
          this.casinoActionRepository.create(finalActionData);
        await this.casinoActionRepository.save(createdAction);

        // Process RP rewards for the bulk created action
        await this.processRpRewards(finalActionData);

        // Send OneSignal tags for the bulk created action
        await this.sendCasinoActionTags(finalActionData);

        results.successfulRows++;
      } catch (error) {
        // Check if this is a casino not found error (which should be skipped)
        if (
          error.message.includes('not found in internal system or external API')
        ) {
          results.skippedRows++;
          results.errors.push({
            row: i + 1,
            message: `Skipped: ${error.message}`,
          });

          // Always skip these rows, even if skipErrors is false
          continue;
        }

        // Regular errors
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

  private parseCSVRow(line: string, separator: string = ','): string[] {
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
      } else if (char === separator && !inQuotes) {
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

    // Validate visitor_id (mapped from click_id_casino)
    if (!row.visitor_id || row.visitor_id.trim() === '') {
      throw new Error('click_id_casino is required');
    }

    // Parse and validate date_of_action (mapped from date_casino)
    let dateOfAction: Date;
    try {
      const dateStr = row.date_of_action.toString().trim();

      // Check for DD/MM/YY or DD/M/YY format (like "14/9/25")
      const ddmmyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
      const ddmmyyMatch = dateStr.match(ddmmyyPattern);

      if (ddmmyyMatch) {
        let [, day, month, year] = ddmmyyMatch;

        // Convert 2-digit year to 4-digit (assuming 20xx for years 00-30, 19xx for 31-99)
        if (year.length === 2) {
          const yearNum = parseInt(year, 10);
          year = yearNum <= 30 ? `20${year}` : `19${year}`;
        }

        // Create date in YYYY-MM-DD format
        const isoDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        dateOfAction = new Date(isoDateStr);
      } else {
        // Try standard date parsing
        dateOfAction = new Date(dateStr);
      }

      if (isNaN(dateOfAction.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      throw new Error(
        'date_casino must be a valid date (YYYY-MM-DD, YYYY-MM-DD HH:MM:SS, or DD/MM/YY)',
      );
    }

    // Parse registration boolean (mapped from reg_casino)
    const registration = this.parseBoolean(row.registration, 'reg_casino');

    // Parse deposit boolean (mapped from ftd_casino)
    const deposit = this.parseBoolean(row.deposit, 'ftd_casino');

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
