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
var VoucherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const voucher_entity_1 = require("../../entities/voucher.entity");
const voucher_request_entity_1 = require("../../entities/voucher-request.entity");
const player_entity_1 = require("../../entities/player.entity");
const rp_balance_transaction_entity_1 = require("../../entities/rp-balance-transaction.entity");
const onesignal_service_1 = require("../../external/onesignal/onesignal.service");
let VoucherService = VoucherService_1 = class VoucherService {
    voucherRepository;
    voucherRequestRepository;
    playerRepository;
    rpTransactionRepository;
    dataSource;
    oneSignalService;
    logger = new common_1.Logger(VoucherService_1.name);
    constructor(voucherRepository, voucherRequestRepository, playerRepository, rpTransactionRepository, dataSource, oneSignalService) {
        this.voucherRepository = voucherRepository;
        this.voucherRequestRepository = voucherRequestRepository;
        this.playerRepository = playerRepository;
        this.rpTransactionRepository = rpTransactionRepository;
        this.dataSource = dataSource;
        this.oneSignalService = oneSignalService;
    }
    async findAllVouchers() {
        return this.voucherRepository.find({
            order: { created_at: 'DESC' },
        });
    }
    async createVoucherRequest(userId, voucherId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const player = await queryRunner.manager.findOne(player_entity_1.Player, {
                where: { id: userId, is_deleted: false },
                lock: { mode: 'pessimistic_write' },
            });
            if (!player) {
                throw new common_1.NotFoundException('User not found');
            }
            if (!player.email_verified) {
                throw new common_1.BadRequestException('Email verification required. Please verify your email address before requesting vouchers.');
            }
            const voucher = await queryRunner.manager.findOne(voucher_entity_1.Voucher, {
                where: { id: voucherId },
            });
            if (!voucher) {
                throw new common_1.NotFoundException('Voucher not found');
            }
            if (player.rp_balance < voucher.rp_price) {
                throw new common_1.BadRequestException(`Insufficient RP balance. Required: ${voucher.rp_price} RP, Available: ${player.rp_balance} RP`);
            }
            const balanceBefore = player.rp_balance;
            const balanceAfter = balanceBefore - voucher.rp_price;
            await queryRunner.manager.update(player_entity_1.Player, userId, {
                rp_balance: balanceAfter,
            });
            const rpTransaction = queryRunner.manager.create(rp_balance_transaction_entity_1.RpBalanceTransaction, {
                user_id: userId,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                amount: -voucher.rp_price,
                mode: 'voucher_purchase',
                reason: `Voucher purchase: ${voucher.name}`,
            });
            await queryRunner.manager.save(rpTransaction);
            const voucherRequest = queryRunner.manager.create(voucher_request_entity_1.VoucherRequest, {
                user_id: userId,
                voucher_id: voucherId,
                request_date: new Date(),
                status: voucher_request_entity_1.VoucherRequestStatus.REQUESTED,
            });
            const savedVoucherRequest = await queryRunner.manager.save(voucherRequest);
            await queryRunner.commitTransaction();
            await this.sendRpBalanceTag(player.visitor_id, balanceAfter);
            const requestWithRelations = await this.voucherRequestRepository.findOne({
                where: { id: savedVoucherRequest.id },
                relations: ['user', 'voucher'],
            });
            if (!requestWithRelations) {
                throw new Error('Failed to retrieve created voucher request');
            }
            return {
                voucherRequest: requestWithRelations,
                rpTransaction: {
                    balance_before: balanceBefore,
                    balance_after: balanceAfter,
                    amount: -voucher.rp_price,
                    mode: 'voucher_purchase',
                    transaction_id: rpTransaction.id,
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async sendRpBalanceTag(visitorId, newBalance) {
        try {
            if (!visitorId) {
                this.logger.warn('Cannot send RP balance tag: visitor_id not found');
                return;
            }
            const tags = {
                RP_points_2500: newBalance >= 2500 ? 'true' : 'false',
            };
            this.logger.log(`Sending RP balance tag for visitor ${visitorId} after voucher purchase: balance=${newBalance}, RP_points_2500=${tags.RP_points_2500}`);
            await this.oneSignalService.updateUserTags(visitorId, tags);
        }
        catch (error) {
            this.logger.error(`Failed to send RP balance tag for visitor ${visitorId}`, error);
        }
    }
};
exports.VoucherService = VoucherService;
exports.VoucherService = VoucherService = VoucherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(voucher_entity_1.Voucher)),
    __param(1, (0, typeorm_1.InjectRepository)(voucher_request_entity_1.VoucherRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(3, (0, typeorm_1.InjectRepository)(rp_balance_transaction_entity_1.RpBalanceTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        onesignal_service_1.OneSignalService])
], VoucherService);
//# sourceMappingURL=voucher.service.js.map