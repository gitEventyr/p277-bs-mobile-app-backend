"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const admin_user_entity_1 = require("../entities/admin-user.entity");
const player_entity_1 = require("../entities/player.entity");
const play_history_entity_1 = require("../entities/play-history.entity");
const in_app_purchase_entity_1 = require("../entities/in-app-purchase.entity");
const coins_balance_change_entity_1 = require("../entities/coins-balance-change.entity");
const casino_entity_1 = require("../entities/casino.entity");
const casino_action_entity_1 = require("../entities/casino-action.entity");
const admin_service_1 = require("./services/admin.service");
const analytics_service_1 = require("./services/analytics.service");
const casino_service_1 = require("./services/casino.service");
const casino_action_service_1 = require("./services/casino-action.service");
const admin_controller_1 = require("./controllers/admin.controller");
const admin_dashboard_controller_1 = require("./controllers/admin-dashboard.controller");
const analytics_controller_1 = require("./controllers/analytics.controller");
const casino_controller_1 = require("./controllers/casino.controller");
const casino_action_controller_1 = require("./controllers/casino-action.controller");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                admin_user_entity_1.AdminUser,
                player_entity_1.Player,
                play_history_entity_1.PlayHistory,
                in_app_purchase_entity_1.InAppPurchase,
                coins_balance_change_entity_1.CoinsBalanceChange,
                casino_entity_1.Casino,
                casino_action_entity_1.CasinoAction,
            ]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '30d'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [
            admin_controller_1.AdminController,
            admin_dashboard_controller_1.AdminDashboardController,
            analytics_controller_1.AnalyticsController,
            casino_controller_1.CasinoController,
            casino_action_controller_1.CasinoActionController,
        ],
        providers: [
            admin_service_1.AdminService,
            analytics_service_1.AnalyticsService,
            casino_service_1.CasinoService,
            casino_action_service_1.CasinoActionService,
        ],
        exports: [admin_service_1.AdminService, analytics_service_1.AnalyticsService, casino_service_1.CasinoService, casino_action_service_1.CasinoActionService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map