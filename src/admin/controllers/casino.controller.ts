import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Session,
  Res,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import * as session from 'express-session';
import { CasinoService } from '../services/casino.service';
import { CreateCasinoDto } from '../dto/create-casino.dto';
import { UpdateCasinoDto } from '../dto/update-casino.dto';
import { CasinoApiService } from '../../external/casino/casino-api.service';

interface AdminSession extends session.Session {
  admin?: {
    id: string;
    email: string;
    display_name: string;
    token: string;
  };
  flashMessage?: string;
  flashType?: 'success' | 'error' | 'warning' | 'info';
}

@ApiTags('🖥️ Dashboard: Casino Management')
@Controller('admin/casinos')
export class CasinoController {
  constructor(
    private readonly casinoService: CasinoService,
    private readonly casinoApiService: CasinoApiService,
  ) {}

  // Casino Management Page
  @Get()
  async casinos(
    @Session() session: AdminSession,
    @Query() query: any,
    @Res() res: Response,
  ) {
    if (!session.admin) {
      return res.redirect('/admin/login');
    }

    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const search = query.search || '';
      const sortBy = query.sortBy || 'created_at';

      const casinos = await this.casinoService.findAll({
        page,
        limit,
        search,
        sortBy,
      });

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return res.render('admin/casinos', {
        title: 'Casino Management',
        isAuthenticated: true,
        isCasinos: true,
        admin: session.admin,
        casinos: casinos.data,
        pagination: casinos.pagination,
        searchQuery: search,
        sortBy,
        queryString: this.buildQueryString(query),
        flashMessage,
        flashType,
      });
    } catch (error) {
      console.error('Casinos page error:', error);
      return res.render('admin/casinos', {
        title: 'Casino Management',
        isAuthenticated: true,
        isCasinos: true,
        admin: session.admin,
        casinos: [],
        pagination: { total: 0, pages: [], hasPages: false },
        flashMessage: 'Error loading casinos data',
        flashType: 'error',
      });
    }
  }

  // Get Casino Details (API endpoint)
  @Get('api/:id')
  @ApiOperation({ summary: 'Get casino details by ID' })
  @ApiParam({ name: 'id', description: 'Casino ID' })
  @ApiResponse({
    status: 200,
    description: 'Casino details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Casino not found' })
  async getCasinoDetails(
    @Param('id') id: string,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const casino = await this.casinoService.findById(parseInt(id));
      if (!casino) {
        throw new NotFoundException('Casino not found');
      }
      return casino;
    } catch (error) {
      console.error('Get casino error:', error);
      throw new NotFoundException('Casino not found');
    }
  }

  // Create Casino (API endpoint)
  @Post('api')
  @ApiOperation({ summary: 'Create a new casino' })
  @ApiBody({ type: CreateCasinoDto })
  @ApiResponse({ status: 201, description: 'Casino created successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Invalid casino name or casino name already exists',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createCasino(
    @Body() createData: CreateCasinoDto,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { casino_name, casino_id } = createData;

      if (!casino_name) {
        throw new BadRequestException('Casino name is required');
      }

      // Check if casino name already exists
      const existingCasino = await this.casinoService.findByName(casino_name);
      if (existingCasino) {
        throw new BadRequestException('Casino name already exists');
      }

      // Check if casino_id already exists (if provided)
      if (casino_id) {
        const existingCasinoById =
          await this.casinoService.findByCasinoId(casino_id);
        if (existingCasinoById) {
          throw new BadRequestException(
            'Casino ID already exists. Each casino must have a unique casino ID.',
          );
        }
      }

      const casino = await this.casinoService.create({
        casino_name,
        casino_id,
      });
      return casino;
    } catch (error: any) {
      console.error('Create casino error:', error);
      throw error;
    }
  }

  // Update Casino (API endpoint)
  @Put('api/:id')
  @ApiOperation({ summary: 'Update an existing casino' })
  @ApiParam({ name: 'id', description: 'Casino ID' })
  @ApiBody({ type: UpdateCasinoDto })
  @ApiResponse({ status: 200, description: 'Casino updated successfully' })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Invalid casino name or casino name already exists',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Casino not found' })
  async updateCasino(
    @Param('id') id: string,
    @Body() updateData: UpdateCasinoDto,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { casino_name, casino_id } = updateData;

      if (!casino_name) {
        throw new BadRequestException('Casino name is required');
      }

      const casino = await this.casinoService.findById(parseInt(id));
      if (!casino) {
        throw new NotFoundException('Casino not found');
      }

      // Check if casino name already exists (excluding current casino)
      const existingCasino = await this.casinoService.findByName(casino_name);
      if (existingCasino && existingCasino.id.toString() !== id.toString()) {
        throw new BadRequestException('Casino name already exists');
      }

      // Check if casino_id already exists (excluding current casino, if provided)
      if (casino_id) {
        const existingCasinoById =
          await this.casinoService.findByCasinoId(casino_id);
        if (
          existingCasinoById &&
          existingCasinoById.id.toString() !== id.toString()
        ) {
          throw new BadRequestException(
            'Casino ID already exists. Each casino must have a unique casino ID.',
          );
        }
      }

      const updatedCasino = await this.casinoService.update(parseInt(id), {
        casino_name,
        casino_id,
      });
      return updatedCasino;
    } catch (error: any) {
      console.error('Update casino error:', error);
      throw error;
    }
  }

  // Delete Casino (API endpoint)
  @Delete('api/:id')
  @ApiOperation({ summary: 'Delete a casino' })
  @ApiParam({ name: 'id', description: 'Casino ID' })
  @ApiResponse({ status: 200, description: 'Casino deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Casino not found' })
  async deleteCasino(
    @Param('id') id: string,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const casino = await this.casinoService.findById(parseInt(id));
      if (!casino) {
        throw new NotFoundException('Casino not found');
      }

      await this.casinoService.delete(parseInt(id));
      return { success: true, message: 'Casino deleted successfully' };
    } catch (error: any) {
      console.error('Delete casino error:', error);
      throw error;
    }
  }

  // Sync Casinos with External API (API endpoint)
  @Post('api/sync')
  @ApiOperation({ summary: 'Sync casinos with external API' })
  @ApiResponse({ status: 200, description: 'Casinos synced successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async syncCasinos(@Session() session: AdminSession) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      // Check if casino API is configured
      if (!this.casinoApiService.isConfigured()) {
        throw new BadRequestException('Casino API is not configured');
      }

      // Fetch external casinos
      const externalCasinos = await this.casinoApiService.getCasinos();

      console.log(
        `[Casino Sync] Fetched ${externalCasinos.length} casinos from external API`,
      );

      // STEP 1: Validate external API response for duplicates
      const duplicateValidation = this.validateExternalCasinos(externalCasinos);

      if (!duplicateValidation.isValid) {
        // Log detailed error for debugging
        console.error('[Casino Sync] Duplicate validation failed:', {
          duplicateIds: duplicateValidation.duplicateIds,
          duplicateNames: duplicateValidation.duplicateNames,
          allExternalCasinos: externalCasinos.map((c) => ({
            id: c.id,
            admin_name: c.admin_name,
          })),
        });

        // Throw detailed error with full context
        throw new BadRequestException({
          message: 'External API returned duplicate casinos',
          duplicateIds: duplicateValidation.duplicateIds,
          duplicateNames: duplicateValidation.duplicateNames,
          externalCasinos: externalCasinos.map((c) => ({
            id: c.id,
            name: c.admin_name,
          })),
        });
      }

      // Fetch internal casinos
      const internalCasinos = await this.casinoService.findAllForSync();

      console.log(
        `[Casino Sync] Found ${internalCasinos.length} casinos in database`,
      );

      let syncedCount = 0;
      const syncResults: Array<{
        casinoName: string;
        matched: boolean;
        externalId?: number;
      }> = [];

      // Match and update existing casinos
      const matchedExternalIds = new Set<number>();

      for (const internalCasino of internalCasinos) {
        const matchingExternal = externalCasinos.find(
          (external) => external.admin_name === internalCasino.casino_name,
        );

        if (matchingExternal) {
          await this.casinoService.updateCasinoId(
            internalCasino.id,
            matchingExternal.id.toString(),
          );
          syncedCount++;
          matchedExternalIds.add(matchingExternal.id);
          syncResults.push({
            casinoName: internalCasino.casino_name,
            matched: true,
            externalId: matchingExternal.id,
          });
          console.log(
            `[Casino Sync] Updated casino: ${internalCasino.casino_name} (ID: ${matchingExternal.id})`,
          );
        } else {
          syncResults.push({
            casinoName: internalCasino.casino_name,
            matched: false,
          });
          console.log(
            `[Casino Sync] No match found for: ${internalCasino.casino_name}`,
          );
        }
      }

      // Add missing casinos from external API
      let addedCount = 0;
      for (const externalCasino of externalCasinos) {
        if (!matchedExternalIds.has(externalCasino.id)) {
          // Check if this casino already exists in our system by name
          const existingCasino = await this.casinoService.findByName(
            externalCasino.admin_name,
          );

          if (!existingCasino) {
            try {
              await this.casinoService.create({
                casino_name: externalCasino.admin_name,
                casino_id: externalCasino.id.toString(),
              });
              addedCount++;
              syncResults.push({
                casinoName: externalCasino.admin_name,
                matched: true,
                externalId: externalCasino.id,
              });
              console.log(
                `[Casino Sync] Added new casino: ${externalCasino.admin_name} (ID: ${externalCasino.id})`,
              );
            } catch (createError: any) {
              // Catch and provide detailed error for database constraint violations
              console.error(
                `[Casino Sync] Failed to create casino: ${externalCasino.admin_name} (ID: ${externalCasino.id})`,
                createError.message,
              );

              // Check if it's a duplicate key error
              if (createError.message?.includes('duplicate key')) {
                throw new BadRequestException({
                  message: `Duplicate entry detected when creating casino "${externalCasino.admin_name}"`,
                  failedCasino: {
                    id: externalCasino.id,
                    name: externalCasino.admin_name,
                  },
                  allExternalCasinos: externalCasinos.map((c) => ({
                    id: c.id,
                    name: c.admin_name,
                  })),
                  error: createError.message,
                });
              }

              // Re-throw original error if not a duplicate
              throw createError;
            }
          } else {
            console.log(
              `[Casino Sync] Casino already exists: ${externalCasino.admin_name}`,
            );
          }
        }
      }

      console.log(
        `[Casino Sync] Completed: ${syncedCount} synced, ${addedCount} added`,
      );

      return {
        success: true,
        message: `Synced ${syncedCount} existing casinos and added ${addedCount} new casinos from external API`,
        syncedCount,
        addedCount,
        totalCasinos: internalCasinos.length,
        externalCasinosFound: externalCasinos.length,
        results: syncResults,
      };
    } catch (error: any) {
      console.error('[Casino Sync] Error:', error);
      throw error;
    }
  }

  /**
   * Validates external casinos for duplicate IDs and names
   * Returns validation result with details about duplicates
   */
  private validateExternalCasinos(
    externalCasinos: Array<{ id: number; admin_name: string }>,
  ): {
    isValid: boolean;
    duplicateIds: Array<{ id: number; count: number; casinos: string[] }>;
    duplicateNames: Array<{ name: string; count: number; ids: number[] }>;
  } {
    const idMap = new Map<number, string[]>();
    const nameMap = new Map<string, number[]>();

    // Track all occurrences
    for (const casino of externalCasinos) {
      // Track IDs
      if (!idMap.has(casino.id)) {
        idMap.set(casino.id, []);
      }
      idMap.get(casino.id)!.push(casino.admin_name);

      // Track names
      if (!nameMap.has(casino.admin_name)) {
        nameMap.set(casino.admin_name, []);
      }
      nameMap.get(casino.admin_name)!.push(casino.id);
    }

    // Find duplicates
    const duplicateIds: Array<{
      id: number;
      count: number;
      casinos: string[];
    }> = [];
    const duplicateNames: Array<{
      name: string;
      count: number;
      ids: number[];
    }> = [];

    for (const [id, names] of idMap.entries()) {
      if (names.length > 1) {
        duplicateIds.push({
          id,
          count: names.length,
          casinos: names,
        });
      }
    }

    for (const [name, ids] of nameMap.entries()) {
      if (ids.length > 1) {
        duplicateNames.push({
          name,
          count: ids.length,
          ids,
        });
      }
    }

    return {
      isValid: duplicateIds.length === 0 && duplicateNames.length === 0,
      duplicateIds,
      duplicateNames,
    };
  }

  // Helper Methods
  private buildQueryString(query: any) {
    const params = new URLSearchParams();
    Object.keys(query).forEach((key) => {
      if (query[key] && key !== 'page') {
        params.append(key, query[key]);
      }
    });
    return params.toString();
  }
}
