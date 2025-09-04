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

@ApiTags('Admin - Casino Management')
@Controller('admin/casinos')
export class CasinoController {
  constructor(private readonly casinoService: CasinoService) {}

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
  @ApiResponse({ status: 200, description: 'Casino details retrieved successfully' })
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
  @ApiResponse({ status: 400, description: 'Bad request - Invalid casino name or casino name already exists' })
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

      const casino = await this.casinoService.create({ casino_name, casino_id });
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
  @ApiResponse({ status: 400, description: 'Bad request - Invalid casino name or casino name already exists' })
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
      if (existingCasino && existingCasino.id !== parseInt(id)) {
        throw new BadRequestException('Casino name already exists');
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
