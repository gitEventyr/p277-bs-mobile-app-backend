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
exports.BalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../../entities/player.entity");
const coins_balance_change_entity_1 = require("../../entities/coins-balance-change.entity");
let BalanceService = class BalanceService {
    playerRepository;
    balanceChangeRepository;
    dataSource;
    constructor(playerRepository, balanceChangeRepository, dataSource) {
        this.playerRepository = playerRepository;
        this.balanceChangeRepository = balanceChangeRepository;
        this.dataSource = dataSource;
    }
    async getBalance(userId) {
        const player = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
            select: ['id', 'coins_balance', 'scratch_cards'],
        });
        if (!player) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            coins_balance: player.coins_balance,
            scratch_cards: player.scratch_cards,
        };
    }
    async increaseBalance(userId, balanceChangeDto) {
        if (balanceChangeDto.amount <= 0) {
            throw new common_1.BadRequestException('Amount must be positive');
        }
        return this.updateBalance(userId, balanceChangeDto.amount, balanceChangeDto.mode || 'increase');
    }
    async decreaseBalance(userId, balanceChangeDto) {
        if (balanceChangeDto.amount <= 0) {
            throw new common_1.BadRequestException('Amount must be positive');
        }
        return this.updateBalance(userId, -balanceChangeDto.amount, balanceChangeDto.mode || 'decrease');
    }
    async modifyBalance(userId, modifyBalanceDto) {
        if (modifyBalanceDto.amount === 0) {
            throw new common_1.BadRequestException('Amount cannot be zero');
        }
        const mode = modifyBalanceDto.mode ||
            (modifyBalanceDto.amount > 0 ? 'increase' : 'decrease');
        return this.updateBalance(userId, modifyBalanceDto.amount, mode);
    }
    async updateBalance(userId, amount, mode) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const player = await queryRunner.manager.findOne(player_entity_1.Player, {
                where: { id: userId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!player) {
                throw new common_1.NotFoundException('User not found');
            }
            const balanceBefore = player.coins_balance;
            const balanceAfter = balanceBefore + amount;
            if (balanceAfter < 0) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            await queryRunner.manager.update(player_entity_1.Player, userId, {
                coins_balance: balanceAfter,
            });
            const balanceChange = queryRunner.manager.create(coins_balance_change_entity_1.CoinsBalanceChange, {
                user_id: userId,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                amount: amount,
                mode: mode,
                status: 'completed',
            });
            await queryRunner.manager.save(balanceChange);
            await queryRunner.commitTransaction();
            return {
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                amount: amount,
                mode: mode,
                transaction_id: balanceChange.id,
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
    async getTransactionHistory(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await this.balanceChangeRepository.findAndCount({
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
    async getTransactionById(userId, transactionId) {
        const transaction = await this.balanceChangeRepository.findOne({
            where: { id: transactionId, user_id: userId },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async adminAdjustBalance(userId, amount, reason) {
        const balanceChangeDto = {
            amount: Math.abs(amount),
            mode: `admin_adjustment_${amount >= 0 ? 'increase' : 'decrease'}_${reason}`,
        };
        if (amount >= 0) {
            return this.increaseBalance(userId, balanceChangeDto);
        }
        else {
            return this.decreaseBalance(userId, balanceChangeDto);
        }
    }
};
exports.BalanceService = BalanceService;
exports.BalanceService = BalanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(coins_balance_change_entity_1.CoinsBalanceChange)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], BalanceService);
//# sourceMappingURL=balance.service.js.map