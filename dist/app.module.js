"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const database_config_1 = require("./config/database.config");
const player_entity_1 = require("./entities/player.entity");
const admin_user_entity_1 = require("./entities/admin-user.entity");
const device_entity_1 = require("./entities/device.entity");
const coins_balance_change_entity_1 = require("./entities/coins-balance-change.entity");
const play_history_entity_1 = require("./entities/play-history.entity");
const in_app_purchase_entity_1 = require("./entities/in-app-purchase.entity");
const voucher_entity_1 = require("./entities/voucher.entity");
const user_voucher_entity_1 = require("./entities/user-voucher.entity");
const password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
const rp_balance_transaction_entity_1 = require("./entities/rp-balance-transaction.entity");
const casino_entity_1 = require("./entities/casino.entity");
const casino_action_entity_1 = require("./entities/casino-action.entity");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const email_module_1 = require("./email/email.module");
const admin_module_1 = require("./admin/admin.module");
const users_module_1 = require("./users/users.module");
const devices_module_1 = require("./devices/devices.module");
const games_module_1 = require("./games/games.module");
const purchases_module_1 = require("./purchases/purchases.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    ...(0, database_config_1.createDatabaseConfig)(configService),
                    entities: [
                        player_entity_1.Player,
                        admin_user_entity_1.AdminUser,
                        device_entity_1.Device,
                        coins_balance_change_entity_1.CoinsBalanceChange,
                        rp_balance_transaction_entity_1.RpBalanceTransaction,
                        play_history_entity_1.PlayHistory,
                        in_app_purchase_entity_1.InAppPurchase,
                        voucher_entity_1.Voucher,
                        user_voucher_entity_1.UserVoucher,
                        password_reset_token_entity_1.PasswordResetToken,
                        casino_entity_1.Casino,
                        casino_action_entity_1.CasinoAction,
                    ],
                }),
            }),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            admin_module_1.AdminModule,
            users_module_1.UsersModule,
            devices_module_1.DevicesModule,
            games_module_1.GamesModule,
            purchases_module_1.PurchasesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map