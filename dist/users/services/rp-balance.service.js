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
var RpBalanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpBalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../../entities/player.entity");
const rp_balance_transaction_entity_1 = require("../../entities/rp-balance-transaction.entity");
const onesignal_service_1 = require("../../external/onesignal/onesignal.service");
let RpBalanceService = RpBalanceService_1 = class RpBalanceService {
    playerRepository;
    rpTransactionRepository;
    dataSource;
    oneSignalService;
    logger = new common_1.Logger(RpBalanceService_1.name);
    constructor(playerRepository, rpTransactionRepository, dataSource, oneSignalService) {
        this.playerRepository = playerRepository;
        this.rpTransactionRepository = rpTransactionRepository;
        this.dataSource = dataSource;
        this.oneSignalService = oneSignalService;
    }
    async modifyRpBalance(userId, modifyRpBalanceDto, adminId) {
        if (modifyRpBalanceDto.amount === 0) {
            throw new common_1.BadRequestException('Amount cannot be zero');
        }
        const mode = this.determineMode(modifyRpBalanceDto.amount, adminId);
        return this.updateRpBalance(userId, modifyRpBalanceDto.amount, mode, modifyRpBalanceDto.reason, adminId);
    }
    async adminAdjustRpBalance(userId, amount, reason, adminId) {
        if (amount === 0) {
            throw new common_1.BadRequestException('Amount cannot be zero');
        }
        const mode = `admin_${amount > 0 ? 'increase' : 'decrease'}`;
        return this.updateRpBalance(userId, amount, mode, reason, adminId);
    }
    async updateRpBalance(userId, amount, mode, reason, adminId) {
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
            const balanceBefore = player.rp_balance;
            const balanceAfter = balanceBefore + amount;
            if (balanceAfter < 0) {
                throw new common_1.BadRequestException('Insufficient RP balance');
            }
            await queryRunner.manager.update(player_entity_1.Player, userId, {
                rp_balance: balanceAfter,
            });
            const rpTransaction = queryRunner.manager.create(rp_balance_transaction_entity_1.RpBalanceTransaction, {
                user_id: userId,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                amount: amount,
                mode: mode,
                reason: reason,
                admin_id: adminId,
            });
            await queryRunner.manager.save(rpTransaction);
            await queryRunner.commitTransaction();
            if (mode === 'increase' || mode === 'decrease') {
                await this.sendRpBalanceTags(player.visitor_id, balanceAfter);
            }
            return {
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                amount: amount,
                mode: mode,
                transaction_id: rpTransaction.id,
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
    async sendRpBalanceTags(visitorId, newBalance) {
        try {
            if (!visitorId) {
                this.logger.warn('Cannot send RP balance tags: visitor_id not found');
                return;
            }
            const tags = {
                last_time_received_rp: new Date().toISOString(),
                RP_points_2500: newBalance >= 2500 ? 'true' : 'false',
            };
            this.logger.log(`Sending RP balance tags for visitor ${visitorId}: balance=${newBalance}, RP_points_2500=${tags.RP_points_2500}`);
            await this.oneSignalService.updateUserTags(visitorId, tags);
        }
        catch (error) {
            this.logger.error(`Failed to send RP balance tags for visitor ${visitorId}`, error);
        }
    }
    async getRpTransactionHistory(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await this.rpTransactionRepository.findAndCount({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: transactions,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async getRpTransactionById(userId, transactionId) {
        const transaction = await this.rpTransactionRepository.findOne({
            where: { id: transactionId, user_id: userId },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('RP transaction not found');
        }
        return transaction;
    }
    determineMode(amount, adminId) {
        const baseMode = amount > 0 ? 'increase' : 'decrease';
        return adminId ? `admin_${baseMode}` : baseMode;
    }
    async getRpBalance(userId) {
        const player = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
            select: ['id', 'rp_balance'],
        });
        if (!player) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            rp_balance: player.rp_balance,
        };
    }
};
exports.RpBalanceService = RpBalanceService;
exports.RpBalanceService = RpBalanceService = RpBalanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(rp_balance_transaction_entity_1.RpBalanceTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        onesignal_service_1.OneSignalService])
], RpBalanceService);
//# sourceMappingURL=rp-balance.service.js.map