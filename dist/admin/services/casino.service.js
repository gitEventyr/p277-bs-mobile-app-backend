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
        const { page, limit, search, sortBy } = options;
        const skip = (page - 1) * limit;
        let whereCondition = {};
        if (search) {
            whereCondition = {
                casino_name: (0, typeorm_2.Like)(`%${search}%`),
            };
        }
        const order = {};
        order[sortBy] = 'DESC';
        const [data, total] = await this.casinoRepository.findAndCount({
            where: whereCondition,
            order,
            skip,
            take: limit,
            relations: ['actions'],
        });
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
};
exports.CasinoService = CasinoService;
exports.CasinoService = CasinoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(casino_entity_1.Casino)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CasinoService);
//# sourceMappingURL=casino.service.js.map