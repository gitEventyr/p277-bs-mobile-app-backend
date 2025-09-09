"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../services/admin.service");
const analytics_service_1 = require("../services/analytics.service");
const admin_login_dto_1 = require("../dto/admin-login.dto");
const users_service_1 = require("../../users/services/users.service");
const balance_service_1 = require("../../users/services/balance.service");
let AdminDashboardController = class AdminDashboardController {
    adminService;
    usersService;
    analyticsService;
    balanceService;
    constructor(adminService, usersService, analyticsService, balanceService) {
        this.adminService = adminService;
        this.usersService = usersService;
        this.analyticsService = analyticsService;
        this.balanceService = balanceService;
    }
    loginPage(session, query) {
        if (session.admin) {
            return { redirect: '/admin/dashboard' };
        }
        const error = session.flashMessage && session.flashType === 'error'
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
    async loginForm(loginDto, session, res) {
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
        }
        catch (error) {
            console.error('Login error:', error);
            session.flashMessage = 'An error occurred during login';
            session.flashType = 'error';
            return res.redirect(`/admin/login?email=${encodeURIComponent(loginDto.email)}`);
        }
    }
    logout(session, res) {
        if (session.destroy) {
            session.destroy((err) => {
                if (err) {
                    console.error('Session destroy error:', err);
                }
                res.redirect('/admin/login');
            });
        }
        else {
            session.admin = undefined;
            session.flashMessage = undefined;
            session.flashType = undefined;
            res.redirect('/admin/login');
        }
    }
    async dashboard(session, res) {
        if (!session.admin) {
            return res.redirect('/admin/login');
        }
        try {
            const stats = await this.analyticsService.getOverviewStats();
            const userAnalytics = await this.analyticsService.getUserAnalytics();
            const revenueAnalytics = await this.analyticsService.getRevenueAnalytics();
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
        }
        catch (error) {
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
    async users(session, query, res) {
        if (!session.admin) {
            return res.redirect('/admin/login');
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
                queryString: this.buildQueryString(query),
                flashMessage,
                flashType,
            });
        }
        catch (error) {
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
    async getUserDetails(id, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const user = await this.usersService.getProfile(parseInt(id));
            return user;
        }
        catch (error) {
            console.error('Get user error:', error);
            throw new common_1.NotFoundException('User not found');
        }
    }
    async updateUser(id, updateData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const profileUpdateData = {
                name: updateData.name,
                email: updateData.email,
                phone: updateData.phone,
                device: updateData.device,
                os: updateData.os,
                level: updateData.level
                    ? parseInt(updateData.level, 10)
                    : undefined,
                scratch_cards: updateData.scratch_cards !== undefined
                    ? parseInt(updateData.scratch_cards, 10)
                    : undefined,
            };
            Object.keys(profileUpdateData).forEach((key) => {
                if (profileUpdateData[key] === undefined) {
                    delete profileUpdateData[key];
                }
            });
            const updatedUser = await this.usersService.updateProfile(parseInt(id, 10), profileUpdateData);
            return updatedUser;
        }
        catch (error) {
            console.error('Update user error:', error);
            throw new Error(error?.message || 'Error updating user');
        }
    }
    async adjustBalance(id, adjustData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const { amount, reason } = adjustData;
            if (!amount || amount === 0) {
                throw new Error('Amount must be a non-zero number');
            }
            if (!reason) {
                throw new Error('Reason is required');
            }
            const result = await this.balanceService.adminAdjustBalance(parseInt(id, 10), amount, reason);
            return result;
        }
        catch (error) {
            console.error('Adjust balance error:', error);
            throw new Error(error?.message || 'Error adjusting balance');
        }
    }
    async createUser(createData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const { name, email, phone, password } = createData;
            if (!name || !email || !password) {
                throw new common_1.BadRequestException('Name, email, and password are required');
            }
            const existingUser = await this.usersService.findByEmail(email);
            if (existingUser) {
                throw new common_1.BadRequestException('Email already exists');
            }
            const user = await this.usersService.createUser({
                name,
                email,
                phone,
                password,
            });
            return user;
        }
        catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }
    async getDashboardStats() {
        try {
            return {
                totalUsers: (await this.usersService.getTotalUsersCount()) || 0,
                activeUsers: (await this.usersService.getActiveUsersCount()) || 0,
                totalBalance: (await this.usersService.getTotalBalance()) || 0,
                newRegistrations: (await this.usersService.getNewRegistrationsCount()) || 0,
            };
        }
        catch (error) {
            console.error('Dashboard stats error:', error);
            return {
                totalUsers: 0,
                activeUsers: 0,
                totalBalance: 0,
                newRegistrations: 0,
            };
        }
    }
    async getRecentActivity() {
        try {
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
        }
        catch (error) {
            console.error('Recent activity error:', error);
            return [];
        }
    }
    async getUsersList(options) {
        try {
            const users = await this.usersService.findUsersForAdmin(options);
            return {
                data: users.data || [],
                pagination: this.buildPagination(options.page, options.limit, users.total || 0),
            };
        }
        catch (error) {
            console.error('Get users list error:', error);
            return {
                data: [],
                pagination: { total: 0, pages: [], hasPages: false },
            };
        }
    }
    buildPagination(page, limit, total) {
        const totalPages = Math.ceil(total / limit);
        const from = (page - 1) * limit + 1;
        const to = Math.min(page * limit, total);
        const pages = [];
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
    buildQueryString(query) {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
            if (query[key] && key !== 'page') {
                params.append(key, query[key]);
            }
        });
        return params.toString();
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Render)('admin/login'),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "loginPage", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "loginForm", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "users", null);
__decorate([
    (0, common_1.Get)('api/users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.Post)('api/users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('api/users/:id/adjust-balance'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "adjustBalance", null);
__decorate([
    (0, common_1.Post)('api/users'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "createUser", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        users_service_1.UsersService,
        analytics_service_1.AnalyticsService,
        balance_service_1.BalanceService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map