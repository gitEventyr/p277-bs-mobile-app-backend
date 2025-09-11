"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const purchases_controller_1 = require("./controllers/purchases.controller");
const purchases_service_1 = require("./services/purchases.service");
const payment_validation_service_1 = require("../external/payments/payment-validation.service");
const users_module_1 = require("../users/users.module");
const in_app_purchase_entity_1 = require("../entities/in-app-purchase.entity");
const player_entity_1 = require("../entities/player.entity");
const coins_balance_change_entity_1 = require("../entities/coins-balance-change.entity");
let PurchasesModule = class PurchasesModule {
};
exports.PurchasesModule = PurchasesModule;
exports.PurchasesModule = PurchasesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([in_app_purchase_entity_1.InAppPurchase, player_entity_1.Player, coins_balance_change_entity_1.CoinsBalanceChange]),
            users_module_1.UsersModule,
        ],
        controllers: [purchases_controller_1.PurchasesController],
        providers: [purchases_service_1.PurchasesService, payment_validation_service_1.PaymentValidationService],
        exports: [purchases_service_1.PurchasesService],
    })
], PurchasesModule);
//# sourceMappingURL=purchases.module.js.map