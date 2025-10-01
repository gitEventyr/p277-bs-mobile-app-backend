import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Res,
  Session,
  Query,
  Param,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import * as session from 'express-session';
import { AdminService } from '../services/admin.service';
import { AnalyticsService } from '../services/analytics.service';
import { VoucherService } from '../services/voucher.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { UsersService } from '../../users/services/users.service';
import { BalanceService } from '../../users/services/balance.service';
import { RpBalanceService } from '../../users/services/rp-balance.service';

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

@Controller('admin')
export class AdminDashboardController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly analyticsService: AnalyticsService,
    private readonly balanceService: BalanceService,
    private readonly rpBalanceService: RpBalanceService,
    private readonly voucherService: VoucherService,
  ) {}

  // Admin Login Page
  @Get('login')
  @Render('admin/login')
  loginPage(@Session() session: AdminSession, @Query() query: any) {
    // Redirect if already logged in
    if (session.admin) {
      return { redirect: '/admin/dashboard' };
    }

    const error =
      session.flashMessage && session.flashType === 'error'
        ? session.flashMessage
        : null;
    delete session.flashMessage;
    delete session.flashType;

    return {
      title: 'Login',
      error,
      email: query.email || '',
    };
  }

  // Admin Login Form Handler
  @Post('auth/login')
  async loginForm(
    @Body() loginDto: AdminLoginDto,
    @Session() session: AdminSession,
    @Res() res: Response,
  ) {
    try {
      const result = await this.adminService.login(loginDto);

      session.admin = {
        id: result.admin.id,
        email: result.admin.email,
        display_name: result.admin.display_name,
        token: result.access_token,
      };
      session.flashMessage = 'Welcome back!';
      session.flashType = 'success';
      return res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      session.flashMessage = 'An error occurred during login';
      session.flashType = 'error';
      return res.redirect(
        `/admin/login?email=${encodeURIComponent(loginDto.email)}`,
      );
    }
  }

  // Admin Logout
  @Get('logout')
  logout(@Session() session: AdminSession, @Res() res: Response) {
    if (session.destroy) {
      session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.redirect('/admin/login');
      });
    } else {
      // Fallback: just clear session data
      session.admin = undefined;
      session.flashMessage = undefined;
      session.flashType = undefined;
      res.redirect('/admin/login');
    }
  }

  // Admin Dashboard
  @Get('dashboard')
  async dashboard(@Session() session: AdminSession, @Res() res: Response) {
    if (!session.admin) {
      return res.redirect('/admin/login');
    }

    try {
      // Get comprehensive dashboard analytics
      const stats = await this.analyticsService.getOverviewStats();
      const userAnalytics = await this.analyticsService.getUserAnalytics();
      const revenueAnalytics =
        await this.analyticsService.getRevenueAnalytics();
      const gameAnalytics = await this.analyticsService.getGameAnalytics();
      const recentActivity = await this.getRecentActivity();

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return res.render('admin/dashboard', {
        title: 'Dashboard',
        isAuthenticated: true,
        isDashboard: true,
        admin: session.admin,
        stats,
        userAnalytics,
        revenueAnalytics,
        gameAnalytics,
        recentActivity,
        flashMessage,
        flashType,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.render('admin/dashboard', {
        title: 'Dashboard',
        isAuthenticated: true,
        isDashboard: true,
        admin: session.admin,
        stats: {
          totalUsers: 0,
          activeUsers: 0,
          totalBalance: 0,
          averageBalance: 0,
          newRegistrations: 0,
          totalRevenue: 0,
          totalGamesPlayed: 0,
        },
        userAnalytics: {
          registrationTrends: [],
          retentionMetrics: { dayOne: 0, daySeven: 0, dayThirty: 0 },
          userLevelDistribution: [],
          geographicDistribution: [],
        },
        revenueAnalytics: {
          dailyRevenue: [],
          revenueByPlatform: [],
          averageTransactionValue: 0,
          topSpenders: [],
        },
        gameAnalytics: {
          gamePerformance: [],
          dailyGameActivity: [],
          playerBehavior: {
            totalActivePlayers: 0,
            avgPlaysPerPlayer: 0,
            avgBetPerPlayer: 0,
            totalGameRevenue: 0,
          },
        },
        recentActivity: [],
        flashMessage: 'Error loading dashboard data',
        flashType: 'error',
      });
    }
  }

  // User Management Page
  @Get('users')
  async users(
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
      const status = query.status || '';
      const sortBy = query.sortBy || 'created_at';
      const email_verified = query.email_verified || '';
      const phone_verified = query.phone_verified || '';

      const users = await this.getUsersList({
        page,
        limit,
        search,
        status,
        sortBy,
        email_verified,
        phone_verified,
      });

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return res.render('admin/users', {
        title: 'User Management',
        isAuthenticated: true,
        isUsers: true,
        admin: session.admin,
        users: users.data,
        pagination: users.pagination,
        searchQuery: search,
        statusFilter: status,
        sortBy,
        emailVerifiedFilter: email_verified,
        phoneVerifiedFilter: phone_verified,
        queryString: this.buildQueryString(query),
        flashMessage,
        flashType,
      });
    } catch (error) {
      console.error('Users page error:', error);
      return res.render('admin/users', {
        title: 'User Management',
        isAuthenticated: true,
        isUsers: true,
        admin: session.admin,
        users: [],
        pagination: { total: 0, pages: [], hasPages: false },
        flashMessage: 'Error loading users data',
        flashType: 'error',
      });
    }
  }

  // Get User Details (AJAX endpoint)
  @Get('api/users/:id')
  async getUserDetails(
    @Param('id') id: string,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const user = await this.usersService.getProfile(parseInt(id));
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      throw new NotFoundException('User not found');
    }
  }

  // Update User (Admin endpoint)
  @Post('api/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Record<string, any>,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      // Map admin form data to UpdateProfileDto format
      const profileUpdateData: Record<string, any> = {
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        device: updateData.device,
        os: updateData.os,
        level: updateData.level
          ? parseInt(updateData.level as string, 10)
          : undefined,
        scratch_cards:
          updateData.scratch_cards !== undefined
            ? parseInt(updateData.scratch_cards as string, 10)
            : undefined,
      };

      // Remove undefined values
      Object.keys(profileUpdateData).forEach((key) => {
        if (profileUpdateData[key] === undefined) {
          delete profileUpdateData[key];
        }
      });

      const updatedUser = await this.usersService.updateProfile(
        parseInt(id, 10),
        profileUpdateData,
      );
      return updatedUser;
    } catch (error: any) {
      console.error('Update user error:', error);

      // Handle specific database constraint errors
      if (error.message && error.message.includes('already in use')) {
        throw new BadRequestException(error.message);
      }

      // Handle validation errors
      if (
        error.message &&
        (error.message.includes('validation') ||
          error.message.includes('invalid'))
      ) {
        throw new BadRequestException(error.message);
      }

      // Handle not found errors
      if (error.message && error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }

      // For other errors, provide more specific information
      const errorMessage = error?.message || 'Error updating user';
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        constraint: error.constraint,
        detail: error.detail,
      });

      throw new BadRequestException(`Failed to update user: ${errorMessage}`);
    }
  }

  // Adjust User Balance (Admin endpoint)
  @Post('api/users/:id/adjust-balance')
  async adjustBalance(
    @Param('id') id: string,
    @Body() adjustData: { amount: number; reason: string },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { amount, reason } = adjustData;

      if (!amount || amount === 0) {
        throw new Error('Amount must be a non-zero number');
      }

      if (!reason) {
        throw new Error('Reason is required');
      }

      const result = await this.balanceService.adminAdjustBalance(
        parseInt(id, 10),
        amount,
        reason,
      );

      return result;
    } catch (error: any) {
      console.error('Adjust balance error:', error);
      throw new Error(error?.message || 'Error adjusting balance');
    }
  }

  // Adjust User RP Balance (Admin endpoint)
  @Post('api/users/:id/adjust-rp-balance')
  async adjustRpBalance(
    @Param('id') id: string,
    @Body() adjustData: { amount: number; reason: string },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { amount, reason } = adjustData;

      if (!amount || amount === 0) {
        throw new Error('Amount must be a non-zero number');
      }

      if (!reason) {
        throw new Error('Reason is required');
      }

      const result = await this.rpBalanceService.adminAdjustRpBalance(
        parseInt(id, 10),
        amount,
        reason,
        session.admin.id,
      );

      return result;
    } catch (error: any) {
      console.error('Adjust RP balance error:', error);
      throw new Error(error?.message || 'Error adjusting RP balance');
    }
  }

  // Create User (Admin endpoint)
  @Post('api/users')
  async createUser(
    @Body()
    createData: {
      name: string;
      email: string;
      phone?: string;
      password: string;
    },
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const { name, email, phone, password } = createData;

      // Validate required fields
      if (!name || !email || !password) {
        throw new BadRequestException('Name, email, and password are required');
      }

      // Check if email already exists
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // Create user through users service
      const user = await this.usersService.createUser({
        name,
        email,
        phone,
        password,
      });

      return user;
    } catch (error: any) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Helper Methods
  private async getDashboardStats() {
    try {
      // These would typically come from your UsersService
      // For now, returning mock data
      return {
        totalUsers: (await this.usersService.getTotalUsersCount()) || 0,
        activeUsers: (await this.usersService.getActiveUsersCount()) || 0,
        totalBalance: (await this.usersService.getTotalBalance()) || 0,
        newRegistrations:
          (await this.usersService.getNewRegistrationsCount()) || 0,
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalBalance: 0,
        newRegistrations: 0,
      };
    }
  }

  private async getRecentActivity() {
    try {
      // Mock recent activity data
      return [
        {
          name: 'John Doe',
          activity: 'Registered',
          type: 'success',
          time: '2 minutes ago',
        },
        {
          name: 'Jane Smith',
          activity: 'Login',
          type: 'info',
          time: '5 minutes ago',
        },
        {
          name: 'Bob Johnson',
          activity: 'Purchase',
          type: 'primary',
          time: '10 minutes ago',
        },
      ];
    } catch (error) {
      console.error('Recent activity error:', error);
      return [];
    }
  }

  private async getUsersList(options: {
    page: number;
    limit: number;
    search: string;
    status: string;
    sortBy: string;
    email_verified?: string;
    phone_verified?: string;
  }) {
    try {
      const users = await this.usersService.findUsersForAdmin(options);
      return {
        data: users.data || [],
        pagination: this.buildPagination(
          options.page,
          options.limit,
          users.total || 0,
        ),
      };
    } catch (error) {
      console.error('Get users list error:', error);
      return {
        data: [],
        pagination: { total: 0, pages: [], hasPages: false },
      };
    }
  }

  private buildPagination(page: number, limit: number, total: number) {
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
    };
  }

  private buildQueryString(query: any) {
    const params = new URLSearchParams();
    Object.keys(query).forEach((key) => {
      if (query[key] && key !== 'page') {
        params.append(key, query[key]);
      }
    });
    return params.toString();
  }

  // Voucher Management Page
  @Get('vouchers')
  async vouchers(@Session() session: AdminSession, @Res() res: Response) {
    if (!session.admin) {
      return res.redirect('/admin/login');
    }

    try {
      const vouchers = await this.voucherService.findAllVouchers();

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return res.render('admin/vouchers', {
        title: 'Voucher Management',
        isAuthenticated: true,
        isVouchers: true,
        admin: session.admin,
        vouchers,
        flashMessage,
        flashType,
      });
    } catch (error) {
      console.error('Vouchers page error:', error);
      return res.render('admin/vouchers', {
        title: 'Voucher Management',
        isAuthenticated: true,
        isVouchers: true,
        admin: session.admin,
        vouchers: [],
        flashMessage: 'Error loading vouchers data',
        flashType: 'error',
      });
    }
  }

  // Voucher Requests Management Page
  @Get('voucher-requests')
  async voucherRequests(
    @Session() session: AdminSession,
    @Query() query: any,
    @Res() res: Response,
  ) {
    if (!session.admin) {
      return res.redirect('/admin/login');
    }

    try {
      const status = query.status || '';
      const voucherRequests =
        await this.voucherService.findAllVoucherRequests(status);

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return res.render('admin/voucher-requests', {
        title: 'Voucher Requests Management',
        isAuthenticated: true,
        isVoucherRequests: true,
        admin: session.admin,
        voucherRequests,
        statusFilter: status,
        flashMessage,
        flashType,
      });
    } catch (error) {
      console.error('Voucher requests page error:', error);
      return res.render('admin/voucher-requests', {
        title: 'Voucher Requests Management',
        isAuthenticated: true,
        isVoucherRequests: true,
        admin: session.admin,
        voucherRequests: [],
        flashMessage: 'Error loading voucher requests data',
        flashType: 'error',
      });
    }
  }
}
