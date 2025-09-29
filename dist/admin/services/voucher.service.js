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
exports.VoucherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const voucher_entity_1 = require("../../entities/voucher.entity");
const voucher_request_entity_1 = require("../../entities/voucher-request.entity");
let VoucherService = class VoucherService {
    voucherRepository;
    voucherRequestRepository;
    constructor(voucherRepository, voucherRequestRepository) {
        this.voucherRepository = voucherRepository;
        this.voucherRequestRepository = voucherRequestRepository;
    }
    async createVoucher(createVoucherDto) {
        const voucher = this.voucherRepository.create(createVoucherDto);
        return await this.voucherRepository.save(voucher);
    }
    async findAllVouchers() {
        return await this.voucherRepository.find({
            order: { created_at: 'DESC' },
        });
    }
    async findVoucherById(id) {
        const voucher = await this.voucherRepository.findOne({ where: { id } });
        if (!voucher) {
            throw new common_1.NotFoundException(`Voucher with ID ${id} not found`);
        }
        return voucher;
    }
    async updateVoucher(id, updateVoucherDto) {
        await this.findVoucherById(id);
        await this.voucherRepository.update(id, updateVoucherDto);
        return this.findVoucherById(id);
    }
    async removeVoucher(id) {
        await this.findVoucherById(id);
        await this.voucherRepository.delete(id);
    }
    async findAllVoucherRequests() {
        return await this.voucherRequestRepository
            .createQueryBuilder('voucherRequest')
            .leftJoinAndSelect('voucherRequest.user', 'user')
            .leftJoinAndSelect('voucherRequest.voucher', 'voucher')
            .select([
            'voucherRequest.id',
            'voucherRequest.user_id',
            'voucherRequest.voucher_id',
            'voucherRequest.request_date',
            'voucherRequest.status',
            'voucherRequest.created_at',
            'voucherRequest.updated_at',
            'user.id',
            'user.name',
            'user.email',
            'user.visitor_id',
            'voucher.id',
            'voucher.name',
            'voucher.type',
            'voucher.rp_price',
            'voucher.amazon_vouchers_equivalent',
        ])
            .orderBy('voucherRequest.created_at', 'DESC')
            .getMany();
    }
    async findVoucherRequestById(id) {
        const voucherRequest = await this.voucherRequestRepository
            .createQueryBuilder('voucherRequest')
            .leftJoinAndSelect('voucherRequest.user', 'user')
            .leftJoinAndSelect('voucherRequest.voucher', 'voucher')
            .select([
            'voucherRequest.id',
            'voucherRequest.user_id',
            'voucherRequest.voucher_id',
            'voucherRequest.request_date',
            'voucherRequest.status',
            'voucherRequest.created_at',
            'voucherRequest.updated_at',
            'user.id',
            'user.name',
            'user.email',
            'user.visitor_id',
            'voucher.id',
            'voucher.name',
            'voucher.type',
            'voucher.rp_price',
            'voucher.amazon_vouchers_equivalent',
        ])
            .where('voucherRequest.id = :id', { id })
            .getOne();
        if (!voucherRequest) {
            throw new common_1.NotFoundException(`Voucher request with ID ${id} not found`);
        }
        return voucherRequest;
    }
    async updateVoucherRequest(id, updateVoucherRequestDto) {
        await this.findVoucherRequestById(id);
        await this.voucherRequestRepository.update(id, updateVoucherRequestDto);
        return this.findVoucherRequestById(id);
    }
    async removeVoucherRequest(id) {
        await this.findVoucherRequestById(id);
        await this.voucherRequestRepository.delete(id);
    }
};
exports.VoucherService = VoucherService;
exports.VoucherService = VoucherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(voucher_entity_1.Voucher)),
    __param(1, (0, typeorm_1.InjectRepository)(voucher_request_entity_1.VoucherRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VoucherService);
//# sourceMappingURL=voucher.service.js.map