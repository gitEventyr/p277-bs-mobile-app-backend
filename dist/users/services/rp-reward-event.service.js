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
var RpRewardEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpRewardEventService = exports.RpRewardEvent = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rp_balance_service_1 = require("./rp-balance.service");
const in_app_purchase_entity_1 = require("../../entities/in-app-purchase.entity");
var RpRewardEvent;
(function (RpRewardEvent) {
    RpRewardEvent["EMAIL_VERIFICATION"] = "email_verification";
    RpRewardEvent["PHONE_VERIFICATION"] = "phone_verification";
    RpRewardEvent["REGISTRATION"] = "registration";
    RpRewardEvent["FIRST_PURCHASE"] = "first_purchase";
    RpRewardEvent["PURCHASE"] = "purchase";
})(RpRewardEvent || (exports.RpRewardEvent = RpRewardEvent = {}));
let RpRewardEventService = RpRewardEventService_1 = class RpRewardEventService {
    rpBalanceService;
    purchaseRepository;
    logger = new common_1.Logger(RpRewardEventService_1.name);
    rewardAmounts = {
        [RpRewardEvent.EMAIL_VERIFICATION]: 50,
        [RpRewardEvent.PHONE_VERIFICATION]: 50,
        [RpRewardEvent.REGISTRATION]: 100,
        [RpRewardEvent.FIRST_PURCHASE]: 2000,
        [RpRewardEvent.PURCHASE]: 1000,
    };
    constructor(rpBalanceService, purchaseRepository) {
        this.rpBalanceService = rpBalanceService;
        this.purchaseRepository = purchaseRepository;
    }
    async awardRpForEvent(userId, event, reason) {
        const amount = this.rewardAmounts[event];
        const eventReason = reason || this.getDefaultReason(event);
        try {
            await this.rpBalanceService.modifyRpBalance(userId, {
                amount,
                reason: eventReason,
            });
            this.logger.log(`Awarded ${amount} RP to user ${userId} for event: ${event}`);
        }
        catch (error) {
            this.logger.error(`Failed to award RP for event ${event} to user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async awardEmailVerificationReward(userId) {
        await this.awardRpForEvent(userId, RpRewardEvent.EMAIL_VERIFICATION, 'Email verification reward');
    }
    async awardPhoneVerificationReward(userId) {
        await this.awardRpForEvent(userId, RpRewardEvent.PHONE_VERIFICATION, 'Phone verification reward');
    }
    async awardRegistrationReward(userId) {
        await this.awardRpForEvent(userId, RpRewardEvent.REGISTRATION, 'Registration completion reward');
    }
    async awardPurchaseReward(userId, productId) {
        const isFirstPurchase = await this.isUserFirstPurchase(userId);
        if (isFirstPurchase) {
            await this.awardRpForEvent(userId, RpRewardEvent.FIRST_PURCHASE, `First purchase reward${productId ? ` (${productId})` : ''}`);
        }
        else {
            await this.awardRpForEvent(userId, RpRewardEvent.PURCHASE, `Purchase reward${productId ? ` (${productId})` : ''}`);
        }
    }
    async isUserFirstPurchase(userId) {
        const purchaseCount = await this.purchaseRepository.count({
            where: { user_id: userId },
        });
        return purchaseCount === 1;
    }
    getDefaultReason(event) {
        const reasonMap = {
            [RpRewardEvent.EMAIL_VERIFICATION]: 'Email verification reward',
            [RpRewardEvent.PHONE_VERIFICATION]: 'Phone verification reward',
            [RpRewardEvent.REGISTRATION]: 'Registration completion reward',
            [RpRewardEvent.FIRST_PURCHASE]: 'First purchase reward',
            [RpRewardEvent.PURCHASE]: 'Purchase reward',
        };
        return reasonMap[event];
    }
};
exports.RpRewardEventService = RpRewardEventService;
exports.RpRewardEventService = RpRewardEventService = RpRewardEventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(in_app_purchase_entity_1.InAppPurchase)),
    __metadata("design:paramtypes", [rp_balance_service_1.RpBalanceService,
        typeorm_2.Repository])
], RpRewardEventService);
//# sourceMappingURL=rp-reward-event.service.js.map