"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./services/auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const admin_guard_1 = require("./guards/admin.guard");
const auth_controller_1 = require("./auth.controller");
const player_entity_1 = require("../entities/player.entity");
const admin_user_entity_1 = require("../entities/admin-user.entity");
const casino_action_entity_1 = require("../entities/casino-action.entity");
const password_reset_token_entity_1 = require("../entities/password-reset-token.entity");
const email_verification_token_entity_1 = require("../entities/email-verification-token.entity");
const phone_verification_token_entity_1 = require("../entities/phone-verification-token.entity");
const email_module_1 = require("../email/email.module");
const devices_module_1 = require("../devices/devices.module");
const sms_module_1 = require("../sms/sms.module");
const casino_api_module_1 = require("../external/casino/casino-api.module");
const users_module_1 = require("../users/users.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule,
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
            typeorm_1.TypeOrmModule.forFeature([
                player_entity_1.Player,
                admin_user_entity_1.AdminUser,
                casino_action_entity_1.CasinoAction,
                password_reset_token_entity_1.PasswordResetToken,
                email_verification_token_entity_1.EmailVerificationToken,
                phone_verification_token_entity_1.PhoneVerificationToken,
            ]),
            email_module_1.EmailModule,
            devices_module_1.DevicesModule,
            sms_module_1.SmsModule,
            casino_api_module_1.CasinoApiModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard],
        exports: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map