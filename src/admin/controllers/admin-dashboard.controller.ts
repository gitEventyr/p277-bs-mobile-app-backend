import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Res,
  Req,
  Session,
  Query,
  Param,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import * as session from 'express-session';
import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedAdmin } from '../../common/types/auth.types';
import { UsersService } from '../../users/services/users.service';

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
  @Render('admin/dashboard')
  async dashboard(@Session() session: AdminSession) {
    if (!session.admin) {
      return { redirect: '/admin/login' };
    }

    try {
      // Get dashboard statistics
      const stats = await this.getDashboardStats();
      const recentActivity = await this.getRecentActivity();

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return {
        title: 'Dashboard',
        isAuthenticated: true,
        isDashboard: true,
        admin: session.admin,
        stats,
        recentActivity,
        flashMessage,
        flashType,
      };
    } catch (error) {
      console.error('Dashboard error:', error);
      return {
        title: 'Dashboard',
        isAuthenticated: true,
        isDashboard: true,
        admin: session.admin,
        stats: {
          totalUsers: 0,
          activeUsers: 0,
          totalBalance: 0,
          newRegistrations: 0,
        },
        recentActivity: [],
        flashMessage: 'Error loading dashboard data',
        flashType: 'error',
      };
    }
  }

  // User Management Page
  @Get('users')
  @Render('admin/users')
  async users(@Session() session: AdminSession, @Query() query: any) {
    if (!session.admin) {
      return { redirect: '/admin/login' };
    }

    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const search = query.search || '';
      const status = query.status || '';
      const sortBy = query.sortBy || 'created_at';

      const users = await this.getUsersList({
        page,
        limit,
        search,
        status,
        sortBy,
      });

      const flashMessage = session.flashMessage;
      const flashType = session.flashType;
      delete session.flashMessage;
      delete session.flashType;

      return {
        title: 'User Management',
        isAuthenticated: true,
        isUsers: true,
        admin: session.admin,
        users: users.data,
        pagination: users.pagination,
        searchQuery: search,
        statusFilter: status,
        sortBy,
        queryString: this.buildQueryString(query),
        flashMessage,
        flashType,
      };
    } catch (error) {
      console.error('Users page error:', error);
      return {
        title: 'User Management',
        isAuthenticated: true,
        isUsers: true,
        admin: session.admin,
        users: [],
        pagination: { total: 0, pages: [], hasPages: false },
        flashMessage: 'Error loading users data',
        flashType: 'error',
      };
    }
  }

  // Get User Details (AJAX endpoint)
  @Get('api/users/:id')
  async getUserDetails(
    @Param('id') id: string,
    @Session() session: AdminSession,
  ) {
    if (!session.admin) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const user = await this.usersService.findById(parseInt(id));
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: 'User not found',
      };
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
}
