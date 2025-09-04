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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as session from 'express-session';
import { CasinoActionService } from '../services/casino-action.service';
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

@Controller('admin/casino-actions')
export class CasinoActionController {
  constructor(
    private readonly casinoActionService: CasinoActionService,
    private readonly casinoService: CasinoService,
  ) {}

  // Casino Actions Management Page
  @Get()
  async casinoActions(
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
      const casinoName = query.casinoName || null;
      const registrationFilter = query.registration || '';
      const depositFilter = query.deposit || '';
      const sortBy = query.sortBy || 'date_of_action';

      const casinoActions = await this.casinoActionService.findAll({
        page,
        limit,
        search,
        casinoName,
        registration: registrationFilter,
        deposit: depositFilter,
        sortBy,
      });

      // Get all casinos for the filter dropdown
      const allCasinos = await this.casinoService.findAll({
        page: 1,
        limit: 1000,
        search: '',
        sortBy: 'casino_name',
      });

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return res.render('admin/casino-actions', {
        title: 'Casino Actions Management',
        isAuthenticated: true,
        isCasinoActions: true,
        admin: session.admin,
        casinoActions: casinoActions.data,
        casinos: allCasinos.data,
        pagination: casinoActions.pagination,
        searchQuery: search,
        selectedCasinoName: casinoName,
        registrationFilter,
        depositFilter,
        sortBy,
        queryString: this.buildQueryString(query),
        flashMessage,
        flashType,
      });
    } catch (error) {
      console.error('Casino actions page error:', error);
      return res.render('admin/casino-actions', {
        title: 'Casino Actions Management',
        isAuthenticated: true,
        isCasinoActions: true,
        admin: session.admin,
        casinoActions: [],
        casinos: [],
        pagination: { total: 0, pages: [], hasPages: false },
        flashMessage: 'Error loading casino actions data',
        flashType: 'error',
      });
    }
  }

  // Get Casino Action Details (API endpoint)
  @Get('api/:id')
  async getCasinoActionDetails(
    @Param('id') id: string,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const casinoAction = await this.casinoActionService.findById(
        parseInt(id),
      );
      if (!casinoAction) {
        throw new NotFoundException('Casino action not found');
      }
      return casinoAction;
    } catch (error) {
      console.error('Get casino action error:', error);
      throw new NotFoundException('Casino action not found');
    }
  }

  // Create Casino Action (API endpoint)
  @Post('api')
  async createCasinoAction(
    @Body()
    createData: {
      casino_name: string;
      date_of_action: string;
      visitor_id: string;
      registration: boolean;
      deposit: boolean;
    },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { casino_name, date_of_action, visitor_id, registration, deposit } =
        createData;

      if (!casino_name || !date_of_action || !visitor_id) {
        throw new BadRequestException(
          'Casino name, date of action, and visitor ID are required',
        );
      }

      // Verify casino exists by name
      const casino = await this.casinoService.findByName(casino_name);
      if (!casino) {
        throw new BadRequestException('Casino not found');
      }

      const casinoAction = await this.casinoActionService.create({
        casino_name,
        date_of_action: new Date(date_of_action),
        visitor_id,
        registration: registration || false,
        deposit: deposit || false,
      });

      return casinoAction;
    } catch (error: any) {
      console.error('Create casino action error:', error);
      throw error;
    }
  }

  // Update Casino Action (API endpoint)
  @Put('api/:id')
  async updateCasinoAction(
    @Param('id') id: string,
    @Body()
    updateData: {
      casino_name?: string;
      date_of_action?: string;
      visitor_id?: string;
      registration?: boolean;
      deposit?: boolean;
    },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const casinoAction = await this.casinoActionService.findById(
        parseInt(id),
      );
      if (!casinoAction) {
        throw new NotFoundException('Casino action not found');
      }

      const updatePayload: any = { ...updateData };

      // Verify casino exists if casino_name is being updated
      if (updateData.casino_name) {
        const casino = await this.casinoService.findByName(updateData.casino_name);
        if (!casino) {
          throw new BadRequestException('Casino not found');
        }
      }

      if (updateData.date_of_action) {
        updatePayload.date_of_action = new Date(updateData.date_of_action);
      }

      const updatedCasinoAction = await this.casinoActionService.update(
        parseInt(id),
        updatePayload,
      );
      return updatedCasinoAction;
    } catch (error: any) {
      console.error('Update casino action error:', error);
      throw error;
    }
  }

  // Delete Casino Action (API endpoint)
  @Delete('api/:id')
  async deleteCasinoAction(
    @Param('id') id: string,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const casinoAction = await this.casinoActionService.findById(
        parseInt(id),
      );
      if (!casinoAction) {
        throw new NotFoundException('Casino action not found');
      }

      await this.casinoActionService.delete(parseInt(id));
      return { success: true, message: 'Casino action deleted successfully' };
    } catch (error: any) {
      console.error('Delete casino action error:', error);
      throw error;
    }
  }

  // Bulk Upload CSV (API endpoint)
  @Post('api/bulk-upload')
  @UseInterceptors(FileInterceptor('csvFile'))
  async bulkUploadCSV(
    @UploadedFile() file: any,
    @Body() body: any,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV file');
    }

    try {
      // Convert buffer to string
      const csvContent = file.buffer.toString('utf-8');

      // Parse options from form data
      const skipErrors = body.skipErrors === 'true';
      const createMissingCasinos = body.createMissingCasinos === 'true';

      // Process the CSV
      const results = await this.casinoActionService.bulkCreateFromCSV(csvContent, {
        skipErrors,
        createMissingCasinos,
      });

      return {
        success: true,
        message: 'CSV upload completed successfully',
        summary: results,
        errors: results.errors,
      };
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      throw new BadRequestException(error.message || 'Failed to process CSV file');
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
