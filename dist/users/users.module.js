"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const player_entity_1 = require("../entities/player.entity");
const coins_balance_change_entity_1 = require("../entities/coins-balance-change.entity");
const rp_balance_transaction_entity_1 = require("../entities/rp-balance-transaction.entity");
const in_app_purchase_entity_1 = require("../entities/in-app-purchase.entity");
const casino_action_entity_1 = require("../entities/casino-action.entity");
const casino_entity_1 = require("../entities/casino.entity");
const users_service_1 = require("./services/users.service");
const balance_service_1 = require("./services/balance.service");
const rp_balance_service_1 = require("./services/rp-balance.service");
const rp_reward_event_service_1 = require("./services/rp-reward-event.service");
const casino_offers_service_1 = require("./services/casino-offers.service");
const users_controller_1 = require("./controllers/users.controller");
const auth_module_1 = require("../auth/auth.module");
const casino_api_module_1 = require("../external/casino/casino-api.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                player_entity_1.Player,
                coins_balance_change_entity_1.CoinsBalanceChange,
                rp_balance_transaction_entity_1.RpBalanceTransaction,
                in_app_purchase_entity_1.InAppPurchase,
                casino_action_entity_1.CasinoAction,
                casino_entity_1.Casino,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            casino_api_module_1.CasinoApiModule,
        ],
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            balance_service_1.BalanceService,
            rp_balance_service_1.RpBalanceService,
            rp_reward_event_service_1.RpRewardEventService,
            casino_offers_service_1.CasinoOffersService,
        ],
        exports: [
            users_service_1.UsersService,
            balance_service_1.BalanceService,
            rp_balance_service_1.RpBalanceService,
            rp_reward_event_service_1.RpRewardEventService,
        ],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map