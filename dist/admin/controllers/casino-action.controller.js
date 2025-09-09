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
exports.CasinoActionController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const casino_action_service_1 = require("../services/casino-action.service");
const casino_service_1 = require("../services/casino.service");
const casino_api_service_1 = require("../../external/casino/casino-api.service");
let CasinoActionController = class CasinoActionController {
    casinoActionService;
    casinoService;
    casinoApiService;
    constructor(casinoActionService, casinoService, casinoApiService) {
        this.casinoActionService = casinoActionService;
        this.casinoService = casinoService;
        this.casinoApiService = casinoApiService;
    }
    async casinoActions(session, query, res) {
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
        }
        catch (error) {
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
    async getCasinoActionDetails(id, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const casinoAction = await this.casinoActionService.findById(parseInt(id));
            if (!casinoAction) {
                throw new common_1.NotFoundException('Casino action not found');
            }
            return casinoAction;
        }
        catch (error) {
            console.error('Get casino action error:', error);
            throw new common_1.NotFoundException('Casino action not found');
        }
    }
    async createCasinoAction(createData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const { casino_name, date_of_action, visitor_id, registration, deposit } = createData;
            if (!casino_name || !date_of_action || !visitor_id) {
                throw new common_1.BadRequestException('Casino name, date of action, and visitor ID are required');
            }
            let casino = await this.casinoService.findByName(casino_name);
            if (!casino) {
                if (this.casinoApiService.isConfigured()) {
                    try {
                        const externalCasinos = await this.casinoApiService.getCasinos();
                        const matchingExternal = externalCasinos.find((external) => external.admin_name === casino_name);
                        if (matchingExternal) {
                            casino = await this.casinoService.create({
                                casino_name,
                                casino_id: matchingExternal.id.toString(),
                            });
                        }
                        else {
                            throw new common_1.BadRequestException(`Casino '${casino_name}' not found in internal system or external API`);
                        }
                    }
                    catch (error) {
                        throw new common_1.BadRequestException(error.message ||
                            'Casino not found and failed to check external API');
                    }
                }
                else {
                    throw new common_1.BadRequestException('Casino not found');
                }
            }
            const casinoAction = await this.casinoActionService.create({
                casino_name,
                date_of_action: new Date(date_of_action),
                visitor_id,
                registration: registration || false,
                deposit: deposit || false,
            });
            return casinoAction;
        }
        catch (error) {
            console.error('Create casino action error:', error);
            throw error;
        }
    }
    async updateCasinoAction(id, updateData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const casinoAction = await this.casinoActionService.findById(parseInt(id));
            if (!casinoAction) {
                throw new common_1.NotFoundException('Casino action not found');
            }
            const updatePayload = { ...updateData };
            if (updateData.casino_name) {
                let casino = await this.casinoService.findByName(updateData.casino_name);
                if (!casino) {
                    if (this.casinoApiService.isConfigured()) {
                        try {
                            const externalCasinos = await this.casinoApiService.getCasinos();
                            const matchingExternal = externalCasinos.find((external) => external.admin_name === updateData.casino_name);
                            if (matchingExternal) {
                                casino = await this.casinoService.create({
                                    casino_name: updateData.casino_name,
                                    casino_id: matchingExternal.id.toString(),
                                });
                            }
                            else {
                                throw new common_1.BadRequestException(`Casino '${updateData.casino_name}' not found in internal system or external API`);
                            }
                        }
                        catch (error) {
                            throw new common_1.BadRequestException(error.message ||
                                'Casino not found and failed to check external API');
                        }
                    }
                    else {
                        throw new common_1.BadRequestException('Casino not found');
                    }
                }
            }
            if (updateData.date_of_action) {
                updatePayload.date_of_action = new Date(updateData.date_of_action);
            }
            const updatedCasinoAction = await this.casinoActionService.update(parseInt(id), updatePayload);
            return updatedCasinoAction;
        }
        catch (error) {
            console.error('Update casino action error:', error);
            throw error;
        }
    }
    async deleteCasinoAction(id, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const casinoAction = await this.casinoActionService.findById(parseInt(id));
            if (!casinoAction) {
                throw new common_1.NotFoundException('Casino action not found');
            }
            await this.casinoActionService.delete(parseInt(id));
            return { success: true, message: 'Casino action deleted successfully' };
        }
        catch (error) {
            console.error('Delete casino action error:', error);
            throw error;
        }
    }
    async bulkUploadCSV(file, body, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        if (!file) {
            throw new common_1.BadRequestException('CSV file is required');
        }
        if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
            throw new common_1.BadRequestException('File must be a CSV file');
        }
        try {
            const csvContent = file.buffer.toString('utf-8');
            const skipErrors = body.skipErrors === 'true';
            const createMissingCasinos = body.createMissingCasinos === 'true';
            const createMissingPlayers = body.createMissingPlayers === 'true';
            const results = await this.casinoActionService.bulkCreateFromCSV(csvContent, {
                skipErrors,
                createMissingCasinos,
                createMissingPlayers,
            });
            return {
                success: true,
                message: 'CSV upload completed successfully',
                summary: results,
                errors: results.errors,
            };
        }
        catch (error) {
            console.error('Bulk upload error:', error);
            throw new common_1.BadRequestException(error.message || 'Failed to process CSV file');
        }
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
exports.CasinoActionController = CasinoActionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CasinoActionController.prototype, "casinoActions", null);
__decorate([
    (0, common_1.Get)('api/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasinoActionController.prototype, "getCasinoActionDetails", null);
__decorate([
    (0, common_1.Post)('api'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CasinoActionController.prototype, "createCasinoAction", null);
__decorate([
    (0, common_1.Put)('api/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CasinoActionController.prototype, "updateCasinoAction", null);
__decorate([
    (0, common_1.Delete)('api/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasinoActionController.prototype, "deleteCasinoAction", null);
__decorate([
    (0, common_1.Post)('api/bulk-upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('csvFile')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CasinoActionController.prototype, "bulkUploadCSV", null);
exports.CasinoActionController = CasinoActionController = __decorate([
    (0, common_1.Controller)('admin/casino-actions'),
    __metadata("design:paramtypes", [casino_action_service_1.CasinoActionService,
        casino_service_1.CasinoService,
        casino_api_service_1.CasinoApiService])
], CasinoActionController);
//# sourceMappingURL=casino-action.controller.js.map