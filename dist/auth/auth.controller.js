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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("./services/auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const admin_guard_1 = require("./guards/admin.guard");
const public_decorator_1 = require("./decorators/public.decorator");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const hide_from_swagger_decorator_1 = require("../common/decorators/hide-from-swagger.decorator");
const mobile_exception_filter_1 = require("../common/filters/mobile-exception.filter");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const password_recovery_dto_1 = require("./dto/password-recovery.dto");
const delete_account_dto_1 = require("./dto/delete-account.dto");
const avatar_upload_dto_1 = require("./dto/avatar-upload.dto");
const request_email_verification_dto_1 = require("./dto/request-email-verification.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const request_phone_verification_dto_1 = require("./dto/request-phone-verification.dto");
const verify_phone_dto_1 = require("./dto/verify-phone.dto");
const player_entity_1 = require("../entities/player.entity");
const password_reset_token_entity_1 = require("../entities/password-reset-token.entity");
const email_verification_token_entity_1 = require("../entities/email-verification-token.entity");
const phone_verification_token_entity_1 = require("../entities/phone-verification-token.entity");
const email_service_1 = require("../email/services/email.service");
const devices_service_1 = require("../devices/services/devices.service");
const twilio_service_1 = require("../sms/services/twilio.service");
const casino_api_service_1 = require("../external/casino/casino-api.service");
const rp_reward_event_service_1 = require("../users/services/rp-reward-event.service");
class TestTokenDto {
    email;
    type;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], TestTokenDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user', enum: ['user', 'admin'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['user', 'admin']),
    __metadata("design:type", String)
], TestTokenDto.prototype, "type", void 0);
let AuthController = AuthController_1 = class AuthController {
    authService;
    playerRepository;
    passwordResetTokenRepository;
    emailVerificationTokenRepository;
    phoneVerificationTokenRepository;
    emailService;
    devicesService;
    twilioService;
    casinoApiService;
    configService;
    rpRewardEventService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, playerRepository, passwordResetTokenRepository, emailVerificationTokenRepository, phoneVerificationTokenRepository, emailService, devicesService, twilioService, casinoApiService, configService, rpRewardEventService) {
        this.authService = authService;
        this.playerRepository = playerRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.phoneVerificationTokenRepository = phoneVerificationTokenRepository;
        this.emailService = emailService;
        this.devicesService = devicesService;
        this.twilioService = twilioService;
        this.casinoApiService = casinoApiService;
        this.configService = configService;
        this.rpRewardEventService = rpRewardEventService;
    }
    generateVisitorId() {
        return ('visitor_' +
            Math.random().toString(36).substr(2, 9) +
            Date.now().toString(36));
    }
    getClientIp(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            '127.0.0.1');
    }
    async register(registerDto, req) {
        if (registerDto.email) {
            const existingUser = await this.playerRepository.findOne({
                where: { email: registerDto.email, is_deleted: false },
            });
            if (existingUser) {
                throw new common_1.ConflictException('This email address is already registered. Please use a different email or try logging in instead.');
            }
        }
        let visitorId;
        if (this.casinoApiService.isConfigured()) {
            try {
                visitorId = await this.casinoApiService.registerUser(registerDto, this.getClientIp(req));
                this.logger.log(`Received visitor_id from casino API: ${visitorId}`);
            }
            catch (error) {
                this.logger.error('Failed to register with casino API, falling back to local generation', error.message);
                throw error;
            }
        }
        else {
            this.logger.warn('Casino API not configured, using local visitor_id generation');
            let attempts = 0;
            do {
                visitorId = this.generateVisitorId();
                attempts++;
                if (attempts > 10) {
                    throw new common_1.BadRequestException('Unable to generate unique visitor ID');
                }
            } while (await this.playerRepository.findOne({
                where: { visitor_id: visitorId, is_deleted: false },
            }));
        }
        const hashedPassword = registerDto.password
            ? await this.authService.hashPassword(registerDto.password)
            : undefined;
        const player = this.playerRepository.create({
            visitor_id: visitorId,
            email: registerDto.email,
            name: registerDto.name,
            phone: registerDto.phone,
            password: hashedPassword,
            coins_balance: 1000,
            level: 1,
            scratch_cards: 0,
            device_udid: registerDto.deviceUDID,
            subscription_agreement: registerDto.subscription_agreement,
            tnc_agreement: registerDto.tnc_agreement,
            os: registerDto.os,
            device: registerDto.device,
            pid: registerDto.appsflyer?.pid,
            c: registerDto.appsflyer?.c,
            af_channel: registerDto.appsflyer?.af_channel,
            af_adset: registerDto.appsflyer?.af_adset,
            af_ad: registerDto.appsflyer?.af_ad,
            af_keywords: registerDto.appsflyer?.af_keywords
                ? [registerDto.appsflyer.af_keywords]
                : undefined,
            is_retargeting: registerDto.appsflyer?.is_retargeting,
            af_click_lookback: registerDto.appsflyer?.af_click_lookback,
            af_viewthrough_lookback: registerDto.appsflyer?.af_viewthrough_lookback,
            af_sub1: registerDto.appsflyer?.af_sub1,
            af_sub2: registerDto.appsflyer?.af_sub2,
            af_sub3: registerDto.appsflyer?.af_sub3,
            af_sub4: registerDto.appsflyer?.af_sub4,
            af_sub5: registerDto.appsflyer?.af_sub5,
        });
        const savedPlayer = await this.playerRepository.save(player);
        if (registerDto.deviceUDID) {
            try {
                await this.devicesService.createOrUpdateDevice(savedPlayer.id, registerDto.deviceUDID, req.headers['user-agent'] || '', this.getClientIp(req));
            }
            catch (deviceError) {
                this.logger.warn('Failed to track device during registration:', deviceError.message);
            }
        }
        try {
            await this.rpRewardEventService.awardRegistrationReward(savedPlayer.id);
        }
        catch (rpError) {
            this.logger.warn('Failed to award registration RP reward:', rpError.message);
        }
        const payload = {
            sub: typeof savedPlayer.id === 'string'
                ? parseInt(savedPlayer.id)
                : savedPlayer.id,
            email: savedPlayer.email || '',
            type: 'user',
        };
        const accessToken = await this.authService.generateJwtToken(payload);
        if (savedPlayer.email) {
            try {
                await this.emailService.sendWelcomeEmail(savedPlayer.email, {
                    name: savedPlayer.name,
                    email: savedPlayer.email,
                    coinsBalance: savedPlayer.coins_balance,
                    ipAddress: this.getClientIp(req),
                });
            }
            catch (emailError) {
                console.warn('Failed to send welcome email:', emailError.message);
            }
        }
        return {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: '30d',
            user: {
                id: savedPlayer.id,
                visitor_id: savedPlayer.visitor_id,
                email: savedPlayer.email,
                name: savedPlayer.name,
                coins_balance: savedPlayer.coins_balance,
                level: savedPlayer.level,
                scratch_cards: savedPlayer.scratch_cards,
                rp_balance: savedPlayer.rp_balance,
                ipaddress: this.getClientIp(req),
                avatar: savedPlayer.avatar,
            },
        };
    }
    async login(loginDto, req) {
        const player = await this.playerRepository.findOne({
            where: { email: loginDto.email, is_deleted: false },
            select: [
                'id',
                'visitor_id',
                'email',
                'name',
                'phone',
                'password',
                'coins_balance',
                'level',
                'scratch_cards',
                'avatar',
            ],
        });
        if (!player || !player.password) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await this.authService.comparePasswords(loginDto.password, player.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (loginDto.deviceUDID) {
            try {
                await this.devicesService.createOrUpdateDevice(player.id, loginDto.deviceUDID, req.headers['user-agent'] || '', this.getClientIp(req));
            }
            catch (deviceError) {
                this.logger.warn('Failed to track device during login:', deviceError.message);
            }
        }
        const payload = {
            sub: typeof player.id === 'string' ? parseInt(player.id) : player.id,
            email: player.email || '',
            type: 'user',
        };
        const accessToken = await this.authService.generateJwtToken(payload);
        return {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: '30d',
            user: {
                id: player.id,
                visitor_id: player.visitor_id,
                email: player.email,
                name: player.name,
                coins_balance: player.coins_balance,
                level: player.level,
                scratch_cards: player.scratch_cards,
                rp_balance: player.rp_balance,
                ipaddress: this.getClientIp(req),
                avatar: player.avatar,
            },
        };
    }
    async generateTestToken(testTokenDto) {
        const payload = {
            sub: testTokenDto.type === 'user' ? 1 : 'admin-uuid',
            email: testTokenDto.email,
            type: testTokenDto.type,
        };
        const token = await this.authService.generateJwtToken(payload);
        return {
            access_token: token,
            token_type: 'Bearer',
            expires_in: '30d',
        };
    }
    async getCurrentUser(user, req) {
        const isAdmin = typeof user.id === 'string';
        const isUser = typeof user.id === 'number';
        if (isUser) {
            const fullUser = await this.playerRepository.findOne({
                where: { id: user.id, is_deleted: false },
            });
            if (!fullUser) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return {
                id: fullUser.id,
                visitor_id: fullUser.visitor_id,
                name: fullUser.name,
                email: fullUser.email,
                phone: fullUser.phone,
                coins_balance: fullUser.coins_balance,
                rp_balance: fullUser.rp_balance,
                level: fullUser.level,
                scratch_cards: fullUser.scratch_cards,
                avatar: fullUser.avatar,
                device_udid: fullUser.device_udid,
                subscription_agreement: fullUser.subscription_agreement,
                tnc_agreement: fullUser.tnc_agreement,
                os: fullUser.os,
                device: fullUser.device,
                age_checkbox: fullUser.age_checkbox,
                auth_user_id: fullUser.auth_user_id,
                created_at: fullUser.created_at,
                updated_at: fullUser.updated_at,
                pid: fullUser.pid,
                c: fullUser.c,
                af_channel: fullUser.af_channel,
                af_adset: fullUser.af_adset,
                af_ad: fullUser.af_ad,
                af_keywords: fullUser.af_keywords,
                is_retargeting: fullUser.is_retargeting,
                af_click_lookback: fullUser.af_click_lookback,
                af_viewthrough_lookback: fullUser.af_viewthrough_lookback,
                af_sub1: fullUser.af_sub1,
                af_sub2: fullUser.af_sub2,
                af_sub3: fullUser.af_sub3,
                af_sub4: fullUser.af_sub4,
                af_sub5: fullUser.af_sub5,
                email_verified: fullUser.email_verified,
                email_verified_at: fullUser.email_verified_at,
                phone_verified: fullUser.phone_verified,
                phone_verified_at: fullUser.phone_verified_at,
                type: 'user',
                ipaddress: this.getClientIp(req),
            };
        }
        return {
            id: user.id,
            email: user.email,
            type: 'admin',
            display_name: user.display_name,
            is_active: user.is_active,
        };
    }
    async getAdminData(admin) {
        return {
            message: 'This is admin-only data',
            admin: {
                id: admin.id,
                email: admin.email,
                display_name: admin.display_name,
            },
        };
    }
    async getPublicData() {
        return {
            message: 'This is public data, no authentication required',
            timestamp: new Date().toISOString(),
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.playerRepository.findOne({
            where: { email: forgotPasswordDto.email, is_deleted: false },
        });
        if (!user) {
            return {
                message: 'If the email exists, a password reset link has been sent.',
            };
        }
        const resetCode = this.authService.generateResetCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        const passwordResetToken = this.passwordResetTokenRepository.create({
            token: resetCode,
            user_id: user.id,
            expires_at: expiresAt,
            used: false,
        });
        await this.passwordResetTokenRepository.save(passwordResetToken);
        const baseUrl = this.configService.get('APP_BASE_URL', process.env.NODE_ENV === 'production'
            ? 'https://your-domain.com'
            : `http://localhost:${this.configService.get('PORT', 3000)}`);
        const resetLink = `${baseUrl}/reset-password.html?code=${resetCode}&email=${encodeURIComponent(user.email)}`;
        try {
            await this.emailService.sendPasswordReset(user.email, {
                name: user.name,
                resetUrl: resetLink,
                resetLink: resetLink,
            });
        }
        catch (emailError) {
            this.logger.error('Failed to send password reset email:', emailError);
        }
        return {
            message: 'If the email exists, a password reset code has been sent.',
        };
    }
    async resetPassword(resetPasswordDto) {
        const resetToken = await this.passwordResetTokenRepository.findOne({
            where: {
                token: resetPasswordDto.code,
                used: false,
            },
            relations: ['user'],
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('Invalid or expired reset code');
        }
        if (new Date() > resetToken.expires_at) {
            throw new common_1.BadRequestException('Reset code has expired');
        }
        if (resetToken.user.email !== resetPasswordDto.email) {
            throw new common_1.BadRequestException('Email does not match the reset code');
        }
        const hashedPassword = await this.authService.hashPassword(resetPasswordDto.newPassword);
        await this.passwordResetTokenRepository.update({ id: resetToken.id }, { used: true });
        await this.playerRepository.update({ id: resetToken.user_id }, { password: hashedPassword });
        return {
            message: 'Password reset successfully',
        };
    }
    async logout() {
        await this.authService.logout();
        return {
            message: 'Successfully logged out',
        };
    }
    async uploadAvatar(user, uploadAvatarDto) {
        const base64Data = uploadAvatarDto.avatar.split(',')[1];
        const sizeInBytes = (base64Data.length * 3) / 4;
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (sizeInBytes > maxSizeInBytes) {
            throw new common_1.BadRequestException('Avatar image must be smaller than 5MB');
        }
        await this.playerRepository.update(user.id, {
            avatar: uploadAvatarDto.avatar,
        });
        return {
            message: 'Avatar uploaded successfully',
            avatar: uploadAvatarDto.avatar,
        };
    }
    async deleteAccount(user, deleteAccountDto) {
        await this.authService.softDeleteAccount(user.id);
        return {
            message: 'Account successfully deleted. Your data has been removed from our system.',
        };
    }
    async requestEmailVerification(user) {
        const player = await this.playerRepository.findOne({
            where: { id: user.id },
        });
        if (!player || !player.email) {
            throw new common_1.BadRequestException('No email address found for this account');
        }
        if (player.email_verified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const verificationCode = this.authService.generateResetCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.emailVerificationTokenRepository.update({ user_id: player.id, used: false }, { used: true });
        const emailVerificationToken = this.emailVerificationTokenRepository.create({
            token: verificationCode,
            user_id: player.id,
            expires_at: expiresAt,
            used: false,
        });
        await this.emailVerificationTokenRepository.save(emailVerificationToken);
        try {
            await this.emailService.sendEmailVerification(player.email, {
                name: player.name,
                resetCode: verificationCode,
            });
        }
        catch (emailError) {
            this.logger.error('Failed to send email verification:', emailError);
        }
        return {
            message: 'Verification code sent to your email address',
            expiresIn: 600,
        };
    }
    async verifyEmail(user, verifyEmailDto) {
        const verificationToken = await this.emailVerificationTokenRepository.findOne({
            where: {
                token: verifyEmailDto.code,
                user_id: user.id,
                used: false,
            },
            relations: ['user'],
        });
        if (!verificationToken) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (verificationToken.expires_at < new Date()) {
            throw new common_1.BadRequestException('Verification code has expired');
        }
        verificationToken.used = true;
        await this.emailVerificationTokenRepository.save(verificationToken);
        await this.playerRepository.update({ id: user.id }, {
            email_verified: true,
            email_verified_at: new Date(),
        });
        try {
            await this.rpRewardEventService.awardEmailVerificationReward(user.id);
        }
        catch (rpError) {
            this.logger.warn('Failed to award email verification RP reward:', rpError.message);
        }
        return {
            message: 'Email verified successfully',
            emailVerified: true,
        };
    }
    async requestPhoneVerification(user) {
        const player = await this.playerRepository.findOne({
            where: { id: user.id },
        });
        if (!player || !player.phone) {
            throw new common_1.BadRequestException('No phone number found for this account');
        }
        if (player.phone_verified) {
            throw new common_1.BadRequestException('Phone is already verified');
        }
        try {
            await this.twilioService.sendVerificationCode(player.phone);
        }
        catch (error) {
            this.logger.error('Failed to send phone verification:', error);
            throw error;
        }
        return {
            message: 'Verification code sent to your phone number',
            expiresIn: 600,
        };
    }
    async verifyPhone(user, verifyPhoneDto) {
        const player = await this.playerRepository.findOne({
            where: { id: user.id },
        });
        if (!player || !player.phone) {
            throw new common_1.BadRequestException('No phone number found for this account');
        }
        if (player.phone_verified) {
            throw new common_1.BadRequestException('Phone is already verified');
        }
        const isValid = await this.twilioService.verifyCode(player.phone, verifyPhoneDto.code);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        await this.playerRepository.update({ id: user.id }, {
            phone_verified: true,
            phone_verified_at: new Date(),
        });
        try {
            await this.rpRewardEventService.awardPhoneVerificationReward(user.id);
        }
        catch (rpError) {
            this.logger.warn('Failed to award phone verification RP reward:', rpError.message);
        }
        return {
            message: 'Phone verified successfully',
            phoneVerified: true,
        };
    }
    getBaseUrl() {
        return 'http://localhost:3000';
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user account' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        type: register_dto_1.RegisterResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation errors' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful',
        type: login_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('test-token'),
    (0, public_decorator_1.Public)(),
    (0, hide_from_swagger_decorator_1.HideFromSwagger)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a test JWT token for development' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'JWT token generated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateTestToken", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user information' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('admin-only'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, hide_from_swagger_decorator_1.HideFromSwagger)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin-only endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin-only data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminData", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, public_decorator_1.Public)(),
    (0, hide_from_swagger_decorator_1.HideFromSwagger)(),
    (0, swagger_1.ApiOperation)({ summary: 'Public endpoint (no authentication required)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPublicData", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset email',
        description: 'Sends a password reset email with a mobile deep link to open the app on the reset page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset email sent with mobile deep link',
        type: password_recovery_dto_1.PasswordRecoveryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Email not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_recovery_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with 6-digit code and email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successfully',
        type: password_recovery_dto_1.ResetPasswordResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired reset code' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email does not match reset code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_recovery_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout user',
        description: 'Logout the current user (mobile API) - always succeeds even with invalid token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully logged out',
        type: delete_account_dto_1.LogoutResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('upload-avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload user avatar',
        description: 'Upload a base64 encoded avatar image for the authenticated user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Avatar uploaded successfully',
        type: avatar_upload_dto_1.UploadAvatarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid image format or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, avatar_upload_dto_1.UploadAvatarDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Post)('delete-account'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete user account',
        description: 'Soft delete the current user account (mobile API)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account successfully deleted',
        type: delete_account_dto_1.DeleteAccountResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid password or account validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_account_dto_1.DeleteAccountDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)('request-email-verification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request email verification',
        description: "Sends a 6-digit verification code to the authenticated user's email",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification code sent successfully',
        type: request_email_verification_dto_1.RequestEmailVerificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - email not set or already verified',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestEmailVerification", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify email with 6-digit code',
        description: "Verifies the authenticated user's email using the 6-digit code sent via email",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email verified successfully',
        type: verify_email_dto_1.VerifyEmailResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired verification code',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('request-phone-verification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request phone verification',
        description: "Sends a 6-digit verification code to the authenticated user's phone via Twilio Verify",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification code sent successfully',
        type: request_phone_verification_dto_1.RequestPhoneVerificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - phone not set, already verified, or invalid phone format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPhoneVerification", null);
__decorate([
    (0, common_1.Post)('verify-phone'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify phone with 6-digit code',
        description: "Verifies the authenticated user's phone using the 6-digit code sent via Twilio Verify",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Phone verified successfully',
        type: verify_phone_dto_1.VerifyPhoneResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired verification code',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_phone_dto_1.VerifyPhoneDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPhone", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)('📱 Mobile: Authentication'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UseFilters)(mobile_exception_filter_1.MobileExceptionFilter),
    __param(1, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(2, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __param(3, (0, typeorm_1.InjectRepository)(email_verification_token_entity_1.EmailVerificationToken)),
    __param(4, (0, typeorm_1.InjectRepository)(phone_verification_token_entity_1.PhoneVerificationToken)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        devices_service_1.DevicesService,
        twilio_service_1.TwilioService,
        casino_api_service_1.CasinoApiService,
        config_1.ConfigService,
        rp_reward_event_service_1.RpRewardEventService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map