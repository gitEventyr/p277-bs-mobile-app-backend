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
var PurchasesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const in_app_purchase_entity_1 = require("../../entities/in-app-purchase.entity");
const player_entity_1 = require("../../entities/player.entity");
const coins_balance_change_entity_1 = require("../../entities/coins-balance-change.entity");
const payment_validation_service_1 = require("../../external/payments/payment-validation.service");
let PurchasesService = PurchasesService_1 = class PurchasesService {
    purchaseRepository;
    playerRepository;
    balanceChangeRepository;
    paymentValidationService;
    dataSource;
    logger = new common_1.Logger(PurchasesService_1.name);
    constructor(purchaseRepository, playerRepository, balanceChangeRepository, paymentValidationService, dataSource) {
        this.purchaseRepository = purchaseRepository;
        this.playerRepository = playerRepository;
        this.balanceChangeRepository = balanceChangeRepository;
        this.paymentValidationService = paymentValidationService;
        this.dataSource = dataSource;
    }
    async recordPurchase(userId, purchaseDto) {
        this.logger.log(`Recording purchase for user ${userId}, transaction: ${purchaseDto.transaction_id}`);
        const user = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingPurchase = await this.purchaseRepository.findOne({
            where: { transaction_id: purchaseDto.transaction_id },
        });
        if (existingPurchase) {
            throw new common_1.ConflictException('Transaction already recorded');
        }
        if (purchaseDto.receipt_data) {
            const isValid = await this.paymentValidationService.validateReceipt(purchaseDto.platform, purchaseDto.receipt_data, purchaseDto.transaction_id);
            if (!isValid) {
                this.logger.warn(`Receipt validation failed for transaction: ${purchaseDto.transaction_id}`);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const purchase = queryRunner.manager.create(in_app_purchase_entity_1.InAppPurchase, {
                user_id: userId,
                platform: purchaseDto.platform,
                product_id: purchaseDto.product_id,
                transaction_id: purchaseDto.transaction_id,
                amount: purchaseDto.amount,
                currency: purchaseDto.currency || 'USD',
                purchased_at: new Date(purchaseDto.purchased_at),
            });
            const savedPurchase = await queryRunner.manager.save(purchase);
            const player = await queryRunner.manager.findOne(player_entity_1.Player, {
                where: { id: userId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!player) {
                throw new common_1.NotFoundException('User not found during balance update');
            }
            const balanceBefore = player.coins_balance;
            const balanceAfter = balanceBefore + purchaseDto.coins_amount;
            await queryRunner.manager.update(player_entity_1.Player, userId, {
                coins_balance: balanceAfter,
            });
            const balanceChange = queryRunner.manager.create(coins_balance_change_entity_1.CoinsBalanceChange, {
                user_id: userId,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                amount: purchaseDto.coins_amount,
                mode: `purchase_${purchaseDto.product_id}`,
                status: 'completed',
            });
            const savedBalanceChange = await queryRunner.manager.save(balanceChange);
            await queryRunner.commitTransaction();
            this.logger.log(`Purchase recorded successfully: ${savedPurchase.id}, balance updated: ${balanceAfter}`);
            return {
                purchase: {
                    id: savedPurchase.id,
                    platform: savedPurchase.platform,
                    product_id: savedPurchase.product_id,
                    transaction_id: savedPurchase.transaction_id,
                    amount: savedPurchase.amount,
                    currency: savedPurchase.currency,
                    purchased_at: savedPurchase.purchased_at,
                    created_at: savedPurchase.created_at,
                },
                balance_update: {
                    balance_before: balanceBefore,
                    balance_after: balanceAfter,
                    amount: purchaseDto.coins_amount,
                    mode: `purchase_${purchaseDto.product_id}`,
                    transaction_id: savedBalanceChange.id,
                },
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to record purchase: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getPurchaseHistory(userId, queryDto) {
        const user = await this.playerRepository.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const page = queryDto.page || 1;
        const limit = Math.min(queryDto.limit || 10, 100);
        const skip = (page - 1) * limit;
        const queryBuilder = this.purchaseRepository
            .createQueryBuilder('purchase')
            .where('purchase.user_id = :userId', { userId })
            .orderBy('purchase.created_at', 'DESC');
        if (queryDto.platform) {
            queryBuilder.andWhere('purchase.platform = :platform', {
                platform: queryDto.platform,
            });
        }
        const [purchases, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data: purchases.map((purchase) => ({
                id: purchase.id,
                platform: purchase.platform,
                product_id: purchase.product_id,
                transaction_id: purchase.transaction_id,
                amount: purchase.amount,
                currency: purchase.currency,
                purchased_at: purchase.purchased_at,
                created_at: purchase.created_at,
            })),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getPurchaseById(userId, purchaseId) {
        const purchase = await this.purchaseRepository.findOne({
            where: { id: purchaseId, user_id: userId },
        });
        if (!purchase) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        return {
            id: purchase.id,
            platform: purchase.platform,
            product_id: purchase.product_id,
            transaction_id: purchase.transaction_id,
            amount: purchase.amount,
            currency: purchase.currency,
            purchased_at: purchase.purchased_at,
            created_at: purchase.created_at,
        };
    }
    async getTotalSpent(userId) {
        const result = await this.purchaseRepository
            .createQueryBuilder('purchase')
            .select('SUM(purchase.amount)', 'total')
            .where('purchase.user_id = :userId', { userId })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getPurchaseStats(userId) {
        const [totalSpent, totalPurchases, recentPurchases] = await Promise.all([
            this.getTotalSpent(userId),
            this.purchaseRepository.count({ where: { user_id: userId } }),
            this.purchaseRepository.find({
                where: { user_id: userId },
                order: { created_at: 'DESC' },
                take: 5,
            }),
        ]);
        return {
            total_spent: totalSpent,
            total_purchases: totalPurchases,
            recent_purchases: recentPurchases.map((purchase) => ({
                id: purchase.id,
                product_id: purchase.product_id,
                amount: purchase.amount,
                purchased_at: purchase.purchased_at,
            })),
        };
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = PurchasesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(in_app_purchase_entity_1.InAppPurchase)),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(2, (0, typeorm_1.InjectRepository)(coins_balance_change_entity_1.CoinsBalanceChange)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        payment_validation_service_1.PaymentValidationService,
        typeorm_2.DataSource])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map