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
exports.CasinoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const casino_service_1 = require("../services/casino.service");
const create_casino_dto_1 = require("../dto/create-casino.dto");
const update_casino_dto_1 = require("../dto/update-casino.dto");
const casino_api_service_1 = require("../../external/casino/casino-api.service");
let CasinoController = class CasinoController {
    casinoService;
    casinoApiService;
    constructor(casinoService, casinoApiService) {
        this.casinoService = casinoService;
        this.casinoApiService = casinoApiService;
    }
    async casinos(session, query, res) {
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
        }
        catch (error) {
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
    async getCasinoDetails(id, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const casino = await this.casinoService.findById(parseInt(id));
            if (!casino) {
                throw new common_1.NotFoundException('Casino not found');
            }
            return casino;
        }
        catch (error) {
            console.error('Get casino error:', error);
            throw new common_1.NotFoundException('Casino not found');
        }
    }
    async createCasino(createData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const { casino_name, casino_id } = createData;
            if (!casino_name) {
                throw new common_1.BadRequestException('Casino name is required');
            }
            const existingCasino = await this.casinoService.findByName(casino_name);
            if (existingCasino) {
                throw new common_1.BadRequestException('Casino name already exists');
            }
            const casino = await this.casinoService.create({
                casino_name,
                casino_id,
            });
            return casino;
        }
        catch (error) {
            console.error('Create casino error:', error);
            throw error;
        }
    }
    async updateCasino(id, updateData, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const { casino_name, casino_id } = updateData;
            if (!casino_name) {
                throw new common_1.BadRequestException('Casino name is required');
            }
            const casino = await this.casinoService.findById(parseInt(id));
            if (!casino) {
                throw new common_1.NotFoundException('Casino not found');
            }
            const existingCasino = await this.casinoService.findByName(casino_name);
            if (existingCasino && existingCasino.id !== parseInt(id)) {
                throw new common_1.BadRequestException('Casino name already exists');
            }
            const updatedCasino = await this.casinoService.update(parseInt(id), {
                casino_name,
                casino_id,
            });
            return updatedCasino;
        }
        catch (error) {
            console.error('Update casino error:', error);
            throw error;
        }
    }
    async deleteCasino(id, session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            const casino = await this.casinoService.findById(parseInt(id));
            if (!casino) {
                throw new common_1.NotFoundException('Casino not found');
            }
            await this.casinoService.delete(parseInt(id));
            return { success: true, message: 'Casino deleted successfully' };
        }
        catch (error) {
            console.error('Delete casino error:', error);
            throw error;
        }
    }
    async syncCasinos(session) {
        if (!session.admin) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            if (!this.casinoApiService.isConfigured()) {
                throw new common_1.BadRequestException('Casino API is not configured');
            }
            const externalCasinos = await this.casinoApiService.getCasinos();
            const internalCasinos = await this.casinoService.findAllForSync();
            let syncedCount = 0;
            const syncResults = [];
            const matchedExternalIds = new Set();
            for (const internalCasino of internalCasinos) {
                const matchingExternal = externalCasinos.find((external) => external.admin_name === internalCasino.casino_name);
                if (matchingExternal) {
                    await this.casinoService.updateCasinoId(internalCasino.id, matchingExternal.id.toString());
                    syncedCount++;
                    matchedExternalIds.add(matchingExternal.id);
                    syncResults.push({
                        casinoName: internalCasino.casino_name,
                        matched: true,
                        externalId: matchingExternal.id,
                    });
                }
                else {
                    syncResults.push({
                        casinoName: internalCasino.casino_name,
                        matched: false,
                    });
                }
            }
            let addedCount = 0;
            for (const externalCasino of externalCasinos) {
                if (!matchedExternalIds.has(externalCasino.id)) {
                    const existingCasino = await this.casinoService.findByName(externalCasino.admin_name);
                    if (!existingCasino) {
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
                    }
                }
            }
            return {
                success: true,
                message: `Synced ${syncedCount} existing casinos and added ${addedCount} new casinos from external API`,
                syncedCount,
                addedCount,
                totalCasinos: internalCasinos.length,
                externalCasinosFound: externalCasinos.length,
                results: syncResults,
            };
        }
        catch (error) {
            console.error('Sync casinos error:', error);
            throw error;
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
exports.CasinoController = CasinoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CasinoController.prototype, "casinos", null);
__decorate([
    (0, common_1.Get)('api/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get casino details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Casino ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Casino details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Casino not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasinoController.prototype, "getCasinoDetails", null);
__decorate([
    (0, common_1.Post)('api'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new casino' }),
    (0, swagger_1.ApiBody)({ type: create_casino_dto_1.CreateCasinoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Casino created successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid casino name or casino name already exists',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_casino_dto_1.CreateCasinoDto, Object]),
    __metadata("design:returntype", Promise)
], CasinoController.prototype, "createCasino", null);
__decorate([
    (0, common_1.Put)('api/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing casino' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Casino ID' }),
    (0, swagger_1.ApiBody)({ type: update_casino_dto_1.UpdateCasinoDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Casino updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid casino name or casino name already exists',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Casino not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_casino_dto_1.UpdateCasinoDto, Object]),
    __metadata("design:returntype", Promise)
], CasinoController.prototype, "updateCasino", null);
__decorate([
    (0, common_1.Delete)('api/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a casino' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Casino ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Casino deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Casino not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CasinoController.prototype, "deleteCasino", null);
__decorate([
    (0, common_1.Post)('api/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync casinos with external API' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Casinos synced successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CasinoController.prototype, "syncCasinos", null);
exports.CasinoController = CasinoController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Casino Management'),
    (0, common_1.Controller)('admin/casinos'),
    __metadata("design:paramtypes", [casino_service_1.CasinoService,
        casino_api_service_1.CasinoApiService])
], CasinoController);
//# sourceMappingURL=casino.controller.js.map