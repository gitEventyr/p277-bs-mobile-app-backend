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
exports.CasinoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const casino_entity_1 = require("../../entities/casino.entity");
let CasinoService = class CasinoService {
    casinoRepository;
    constructor(casinoRepository) {
        this.casinoRepository = casinoRepository;
    }
    async findAll(options) {
        const { page, limit, search, sortBy, actionsCount } = options;
        const skip = (page - 1) * limit;
        let query = this.casinoRepository
            .createQueryBuilder('casino')
            .leftJoinAndSelect('casino.actions', 'actions');
        if (search) {
            query = query.andWhere('(casino.casino_name ILIKE :search OR casino.casino_id ILIKE :search)', { search: `%${search}%` });
        }
        if (actionsCount) {
            if (actionsCount === '0') {
                query = query.andWhere('(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) = 0');
            }
            else if (actionsCount === '1-10') {
                query = query.andWhere('(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) BETWEEN 1 AND 10');
            }
            else if (actionsCount === '11-50') {
                query = query.andWhere('(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) BETWEEN 11 AND 50');
            }
            else if (actionsCount === '51+') {
                query = query.andWhere('(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id) > 50');
            }
        }
        let sortByActionsCount = false;
        if (sortBy === 'casino_name') {
            query = query.orderBy('casino.casino_name', 'ASC');
        }
        else if (sortBy === 'actions_count_desc') {
            sortByActionsCount = true;
            query = query
                .loadRelationCountAndMap('casino.actionsCount', 'casino.actions')
                .orderBy('(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id)', 'DESC');
        }
        else if (sortBy === 'actions_count_asc') {
            sortByActionsCount = true;
            query = query
                .loadRelationCountAndMap('casino.actionsCount', 'casino.actions')
                .orderBy('(SELECT COUNT(*) FROM casino_action WHERE casino_action.casino_id = casino.id)', 'ASC');
        }
        else {
            query = query.orderBy('casino.created_at', 'DESC');
        }
        const total = await query.getCount();
        const data = await query.skip(skip).take(limit).getMany();
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
            data,
            pagination: {
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
            },
        };
    }
    async findById(id) {
        return await this.casinoRepository.findOne({
            where: { id },
            relations: ['actions'],
        });
    }
    async findByName(casino_name) {
        return await this.casinoRepository.findOne({
            where: { casino_name },
        });
    }
    async create(createData) {
        const casino = this.casinoRepository.create(createData);
        return await this.casinoRepository.save(casino);
    }
    async update(id, updateData) {
        await this.casinoRepository.update(id, updateData);
        const casino = await this.findById(id);
        if (!casino) {
            throw new Error('Casino not found after update');
        }
        return casino;
    }
    async delete(id) {
        await this.casinoRepository.delete(id);
    }
    async count() {
        return await this.casinoRepository.count();
    }
    async findAllForSync() {
        return await this.casinoRepository.find();
    }
    async updateCasinoId(id, casino_id) {
        await this.casinoRepository.update(id, { casino_id });
    }
};
exports.CasinoService = CasinoService;
exports.CasinoService = CasinoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(casino_entity_1.Casino)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CasinoService);
//# sourceMappingURL=casino.service.js.map