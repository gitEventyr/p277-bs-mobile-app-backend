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
import type { Response } from 'express';
import * as session from 'express-session';
import { CasinoService } from '../services/casino.service';

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
  async createCasino(
    @Body() createData: { casino_name: string },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { casino_name } = createData;

      if (!casino_name) {
        throw new BadRequestException('Casino name is required');
      }

      // Check if casino name already exists
      const existingCasino = await this.casinoService.findByName(casino_name);
      if (existingCasino) {
        throw new BadRequestException('Casino name already exists');
      }

      const casino = await this.casinoService.create({ casino_name });
      return casino;
    } catch (error: any) {
      console.error('Create casino error:', error);
      throw error;
    }
  }

  // Update Casino (API endpoint)
  @Put('api/:id')
  async updateCasino(
    @Param('id') id: string,
    @Body() updateData: { casino_name: string },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { casino_name } = updateData;

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
      });
      return updatedCasino;
    } catch (error: any) {
      console.error('Update casino error:', error);
      throw error;
    }
  }

  // Delete Casino (API endpoint)
  @Delete('api/:id')
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
