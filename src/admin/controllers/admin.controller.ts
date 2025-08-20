import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedAdmin } from '../../common/types/auth.types';

@ApiTags('admin')
@Controller('admin/auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid admin credentials',
  })
  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    return await this.adminService.login(loginDto);
  }

  @ApiOperation({ summary: 'Get current admin profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current admin profile retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Admin authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('me')
  async getProfile(@CurrentUser() admin: AuthenticatedAdmin) {
    return {
      id: admin.id,
      email: admin.email,
      display_name: admin.display_name,
      is_active: admin.is_active,
    };
  }

  @ApiOperation({ summary: 'Test admin-only endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin-only data retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Admin authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin-only')
  async adminOnly(@CurrentUser() admin: AuthenticatedAdmin) {
    return {
      message: 'This is admin-only data',
      admin: {
        id: admin.id,
        email: admin.email,
        display_name: admin.display_name,
      },
    };
  }
}
