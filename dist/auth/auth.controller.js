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
const update_daily_spin_dto_1 = require("./dto/update-daily-spin.dto");
const update_lucky_wheel_dto_1 = require("./dto/update-lucky-wheel.dto");
const update_daily_coins_dto_1 = require("./dto/update-daily-coins.dto");
const confirm_age_dto_1 = require("./dto/confirm-age.dto");
const player_entity_1 = require("../entities/player.entity");
const password_reset_token_entity_1 = require("../entities/password-reset-token.entity");
const email_verification_token_entity_1 = require("../entities/email-verification-token.entity");
const phone_verification_token_entity_1 = require("../entities/phone-verification-token.entity");
const email_service_1 = require("../email/services/email.service");
const devices_service_1 = require("../devices/services/devices.service");
const twilio_service_1 = require("../sms/services/twilio.service");
const casino_api_service_1 = require("../external/casino/casino-api.service");
const rp_reward_event_service_1 = require("../users/services/rp-reward-event.service");
const onesignal_service_1 = require("../external/onesignal/onesignal.service");
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
    oneSignalService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, playerRepository, passwordResetTokenRepository, emailVerificationTokenRepository, phoneVerificationTokenRepository, emailService, devicesService, twilioService, casinoApiService, configService, rpRewardEventService, oneSignalService) {
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
        this.oneSignalService = oneSignalService;
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
            const softDeletedUser = await this.playerRepository.findOne({
                where: { email: registerDto.email, is_deleted: true },
            });
            if (softDeletedUser) {
                const timestamp = new Date().getTime();
                await this.playerRepository.update({ id: softDeletedUser.id }, {
                    email: `${registerDto.email}_deleted_${timestamp}`,
                    updated_at: new Date(),
                });
                this.logger.log(`Cleared soft-deleted user email: ${registerDto.email} -> ${registerDto.email}_deleted_${timestamp}`);
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
        const softDeletedUserWithVisitorId = await this.playerRepository.findOne({
            where: { visitor_id: visitorId, is_deleted: true },
        });
        const hashedPassword = registerDto.password
            ? await this.authService.hashPassword(registerDto.password)
            : undefined;
        let savedPlayer;
        if (softDeletedUserWithVisitorId) {
            this.logger.log(`Found soft-deleted user with visitor_id ${visitorId}, replacing data instead of creating new user`);
            await this.playerRepository.update({ id: softDeletedUserWithVisitorId.id }, {
                email: registerDto.email,
                name: registerDto.name,
                phone: registerDto.phone,
                password: hashedPassword,
                coins_balance: 10000,
                level: 1,
                scratch_cards: 0,
                experience: 0,
                token_version: 1,
                rp_balance: 0,
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
                avatar: undefined,
                email_verified: false,
                email_verified_at: undefined,
                phone_verified: false,
                phone_verified_at: undefined,
                daily_spin_wheel_day_count: 0,
                daily_spin_wheel_last_spin: undefined,
                lucky_wheel_count: 0,
                daily_coins_days_count: 0,
                daily_coins_last_reward: undefined,
                is_deleted: false,
                deleted_at: undefined,
                deletion_reason: undefined,
                created_at: new Date(),
                updated_at: new Date(),
            });
            const updatedPlayer = await this.playerRepository.findOne({
                where: { id: softDeletedUserWithVisitorId.id },
            });
            if (!updatedPlayer) {
                throw new common_1.BadRequestException('Failed to restore user account');
            }
            savedPlayer = updatedPlayer;
        }
        else {
            const player = this.playerRepository.create({
                visitor_id: visitorId,
                email: registerDto.email,
                name: registerDto.name,
                phone: registerDto.phone,
                password: hashedPassword,
                coins_balance: 10000,
                level: 1,
                scratch_cards: 0,
                experience: 0,
                token_version: 1,
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
            savedPlayer = await this.playerRepository.save(player);
        }
        if (registerDto.deviceUDID) {
            try {
                await this.devicesService.createOrUpdateDevice(savedPlayer.id, registerDto.deviceUDID, req.headers['user-agent'] || '', this.getClientIp(req));
            }
            catch (deviceError) {
                this.logger.warn('Failed to track device during registration:', deviceError.message);
            }
        }
        const payload = {
            sub: typeof savedPlayer.id === 'string'
                ? parseInt(savedPlayer.id)
                : savedPlayer.id,
            email: savedPlayer.email || '',
            type: 'user',
            token_version: savedPlayer.token_version,
        };
        const accessToken = await this.authService.generateJwtToken(payload);
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
                experience: savedPlayer.experience,
                scratch_cards: savedPlayer.scratch_cards,
                rp_balance: savedPlayer.rp_balance,
                ipaddress: this.getClientIp(req),
                avatar: savedPlayer.avatar,
                email_verified: savedPlayer.email_verified,
                phone_verified: savedPlayer.phone_verified,
                age_verified: savedPlayer.age_verified_at !== null,
                daily_spin_wheel_day_count: savedPlayer.daily_spin_wheel_day_count,
                daily_spin_wheel_last_spin: savedPlayer.daily_spin_wheel_last_spin,
                lucky_wheel_count: savedPlayer.lucky_wheel_count,
                daily_coins_days_count: savedPlayer.daily_coins_days_count,
                daily_coins_last_reward: savedPlayer.daily_coins_last_reward,
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
                'daily_spin_wheel_last_spin',
                'daily_spin_wheel_day_count',
                'token_version',
            ],
        });
        if (!player || !player.password) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await this.authService.comparePasswords(loginDto.password, player.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const newTokenVersion = (player.token_version || 0) + 1;
        await this.playerRepository.update({ id: player.id }, { token_version: newTokenVersion });
        if (player.daily_spin_wheel_last_spin) {
            const now = new Date();
            const lastSpin = new Date(player.daily_spin_wheel_last_spin);
            const daysDifference = Math.floor((now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDifference >= 2) {
                await this.playerRepository.update({ id: player.id }, {
                    daily_spin_wheel_last_spin: () => 'NULL',
                    daily_spin_wheel_day_count: 0,
                });
            }
        }
        if (loginDto.deviceUDID) {
            try {
                await this.devicesService.createOrUpdateDevice(player.id, loginDto.deviceUDID, req.headers['user-agent'] || '', this.getClientIp(req));
            }
            catch (deviceError) {
                this.logger.warn('Failed to track device during login:', deviceError.message);
            }
        }
        const updatedPlayer = await this.playerRepository.findOne({
            where: { id: player.id, is_deleted: false },
        });
        if (!updatedPlayer) {
            throw new common_1.UnauthorizedException('Player not found');
        }
        const payload = {
            sub: typeof updatedPlayer.id === 'string'
                ? parseInt(updatedPlayer.id)
                : updatedPlayer.id,
            email: updatedPlayer.email || '',
            type: 'user',
            token_version: newTokenVersion,
        };
        const accessToken = await this.authService.generateJwtToken(payload);
        return {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: '30d',
            user: {
                id: updatedPlayer.id,
                visitor_id: updatedPlayer.visitor_id,
                email: updatedPlayer.email,
                name: updatedPlayer.name,
                coins_balance: updatedPlayer.coins_balance,
                level: updatedPlayer.level,
                experience: updatedPlayer.experience,
                scratch_cards: updatedPlayer.scratch_cards,
                rp_balance: updatedPlayer.rp_balance,
                ipaddress: this.getClientIp(req),
                avatar: updatedPlayer.avatar,
                email_verified: updatedPlayer.email_verified,
                phone_verified: updatedPlayer.phone_verified,
                age_verified: updatedPlayer.age_verified_at !== null,
                daily_spin_wheel_day_count: updatedPlayer.daily_spin_wheel_day_count,
                daily_spin_wheel_last_spin: updatedPlayer.daily_spin_wheel_last_spin,
                lucky_wheel_count: updatedPlayer.lucky_wheel_count,
                daily_coins_days_count: updatedPlayer.daily_coins_days_count,
                daily_coins_last_reward: updatedPlayer.daily_coins_last_reward,
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
                experience: fullUser.experience,
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
                age_verified: fullUser.age_verified_at !== null,
                daily_spin_wheel_day_count: fullUser.daily_spin_wheel_day_count,
                daily_spin_wheel_last_spin: fullUser.daily_spin_wheel_last_spin,
                lucky_wheel_count: fullUser.lucky_wheel_count,
                daily_coins_days_count: fullUser.daily_coins_days_count,
                daily_coins_last_reward: fullUser.daily_coins_last_reward,
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
    async confirmAge(user, req) {
        const userId = user.id;
        const clientIp = this.getClientIp(req);
        const userAgent = req.headers['user-agent'] || '';
        const deviceUdid = `age-verification-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const device = await this.devicesService.createOrUpdateDevice(userId, deviceUdid, userAgent, clientIp);
        const ageVerifiedAt = new Date();
        await this.playerRepository.update(userId, {
            age_verified_at: ageVerifiedAt,
            age_verified_ip: clientIp,
            age_verification_device: device.id,
        });
        this.logger.log(`Age verified for user ${userId} from IP ${clientIp} using device ${device.id}`);
        return {
            message: 'Age verified successfully',
            age_verified: true,
            age_verified_at: ageVerifiedAt,
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
                visitorId: user.visitor_id,
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
        const resetTokenAny = await this.passwordResetTokenRepository.findOne({
            where: {
                token: resetPasswordDto.code,
            },
            relations: ['user'],
        });
        if (!resetTokenAny) {
            throw new common_1.BadRequestException('Invalid reset code. Please request a new password reset link.');
        }
        if (resetTokenAny.used) {
            throw new common_1.BadRequestException('This reset link has already been used. Please request a new password reset link.');
        }
        if (new Date() > resetTokenAny.expires_at) {
            throw new common_1.UnauthorizedException('This reset link has expired. Please request a new password reset link.');
        }
        if (resetTokenAny.user.email !== resetPasswordDto.email) {
            throw new common_1.BadRequestException('The email address does not match this reset code.');
        }
        const resetToken = resetTokenAny;
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
    async requestEmailVerification(user, requestDto) {
        const player = await this.playerRepository.findOne({
            where: { id: user.id },
        });
        if (!player) {
            throw new common_1.BadRequestException('User not found');
        }
        const emailToVerify = (requestDto.newEmail && requestDto.newEmail.trim()) || player.email;
        if (!emailToVerify) {
            throw new common_1.BadRequestException('No email address provided');
        }
        const isNewEmail = requestDto.newEmail && requestDto.newEmail.trim();
        if (!isNewEmail && player.email_verified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        if (isNewEmail) {
            const existingUser = await this.playerRepository.findOne({
                where: { email: requestDto.newEmail.trim(), is_deleted: false },
            });
            if (existingUser && existingUser.id !== player.id) {
                throw new common_1.BadRequestException('This email address is already in use');
            }
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
            await this.emailService.sendEmailVerification(emailToVerify, {
                name: player.name,
                resetCode: verificationCode,
                visitorId: player.visitor_id,
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
        const currentUser = await this.playerRepository.findOne({
            where: { id: user.id },
        });
        const oldEmail = currentUser?.email;
        const updateData = {
            email_verified: true,
            email_verified_at: new Date(),
        };
        if (verifyEmailDto.newEmail && verifyEmailDto.newEmail.trim()) {
            const trimmedNewEmail = verifyEmailDto.newEmail.trim();
            const existingUser = await this.playerRepository.findOne({
                where: { email: trimmedNewEmail, is_deleted: false },
            });
            if (existingUser && existingUser.id !== user.id) {
                throw new common_1.BadRequestException('This email address is already in use');
            }
            updateData.email = trimmedNewEmail;
        }
        await this.playerRepository.update({ id: user.id }, updateData);
        const emailProvider = this.configService.get('EMAIL_PROVIDER', 'smtp');
        if (emailProvider.toLowerCase() === 'onesignal' &&
            oldEmail &&
            verifyEmailDto.newEmail &&
            verifyEmailDto.newEmail.trim() &&
            oldEmail !== verifyEmailDto.newEmail.trim()) {
            try {
                await this.oneSignalService.disableSubscription('Email', oldEmail);
                this.logger.log(`Disabled old email subscription in OneSignal: ${oldEmail}`);
            }
            catch (error) {
                this.logger.warn(`Failed to disable old email subscription in OneSignal: ${oldEmail}`, error);
            }
        }
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
    async requestPhoneVerification(user, requestDto) {
        const player = await this.playerRepository.findOne({
            where: { id: user.id },
        });
        if (!player) {
            throw new common_1.BadRequestException('User not found');
        }
        const phoneToVerify = (requestDto.newPhone && requestDto.newPhone.trim()) || player.phone;
        if (!phoneToVerify) {
            throw new common_1.BadRequestException('No phone number provided');
        }
        const isNewPhone = requestDto.newPhone && requestDto.newPhone.trim();
        if (!isNewPhone && player.phone_verified) {
            throw new common_1.BadRequestException('Phone is already verified');
        }
        if (isNewPhone) {
            const existingUser = await this.playerRepository.findOne({
                where: { phone: requestDto.newPhone.trim(), is_deleted: false },
            });
            if (existingUser && existingUser.id !== player.id) {
                throw new common_1.BadRequestException('This phone number is already in use');
            }
        }
        try {
            await this.twilioService.sendVerificationCode(phoneToVerify, player.id, player.visitor_id);
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
        if (!player) {
            throw new common_1.BadRequestException('User not found');
        }
        const phoneToVerify = (verifyPhoneDto.newPhone && verifyPhoneDto.newPhone.trim()) ||
            player.phone;
        if (!phoneToVerify) {
            throw new common_1.BadRequestException('No phone number found for this account');
        }
        const isNewPhone = verifyPhoneDto.newPhone && verifyPhoneDto.newPhone.trim();
        if (!isNewPhone && player.phone_verified) {
            throw new common_1.BadRequestException('Phone is already verified');
        }
        const isValid = await this.twilioService.verifyCode(phoneToVerify, verifyPhoneDto.code, player.id);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        const oldPhone = player.phone;
        const updateData = {
            phone_verified: true,
            phone_verified_at: new Date(),
        };
        if (verifyPhoneDto.newPhone && verifyPhoneDto.newPhone.trim()) {
            updateData.phone = verifyPhoneDto.newPhone.trim();
        }
        await this.playerRepository.update({ id: user.id }, updateData);
        const smsProvider = this.configService.get('SMS_PROVIDER', 'twilio');
        if (smsProvider.toLowerCase() === 'onesignal' &&
            oldPhone &&
            verifyPhoneDto.newPhone &&
            verifyPhoneDto.newPhone.trim() &&
            oldPhone !== verifyPhoneDto.newPhone.trim()) {
            try {
                await this.oneSignalService.disableSubscription('SMS', oldPhone);
                this.logger.log(`Disabled old phone subscription in OneSignal: ${oldPhone}`);
            }
            catch (error) {
                this.logger.warn(`Failed to disable old phone subscription in OneSignal: ${oldPhone}`, error);
            }
        }
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
    async updateDailySpin(user, updateDailySpinDto) {
        const lastSpinTime = updateDailySpinDto.daily_spin_wheel_last_spin
            ? new Date(updateDailySpinDto.daily_spin_wheel_last_spin)
            : new Date();
        await this.playerRepository.update({ id: user.id }, {
            daily_spin_wheel_day_count: updateDailySpinDto.daily_spin_wheel_day_count,
            daily_spin_wheel_last_spin: lastSpinTime,
        });
        return {
            message: 'Daily spin updated successfully',
            daily_spin_wheel_day_count: updateDailySpinDto.daily_spin_wheel_day_count,
            daily_spin_wheel_last_spin: lastSpinTime,
        };
    }
    async updateLuckyWheel(user, updateLuckyWheelDto) {
        await this.playerRepository.update({ id: user.id }, {
            lucky_wheel_count: updateLuckyWheelDto.lucky_wheel_count,
        });
        return {
            message: 'Lucky wheel count updated successfully',
            lucky_wheel_count: updateLuckyWheelDto.lucky_wheel_count,
        };
    }
    async updateDailyCoins(user, updateDailyCoinsDto) {
        const lastRewardTime = updateDailyCoinsDto.daily_coins_last_reward
            ? new Date(updateDailyCoinsDto.daily_coins_last_reward)
            : new Date();
        await this.playerRepository.update({ id: user.id }, {
            daily_coins_days_count: updateDailyCoinsDto.daily_coins_days_count,
            daily_coins_last_reward: lastRewardTime,
        });
        return {
            message: 'Daily coins updated successfully',
            daily_coins_days_count: updateDailyCoinsDto.daily_coins_days_count,
            daily_coins_last_reward: lastRewardTime,
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
    (0, common_1.Post)('confirm-age'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm age verification for mobile users' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Age verified successfully',
        type: confirm_age_dto_1.ConfirmAgeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmAge", null);
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
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid reset code, already used link, or email mismatch',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Reset link has expired',
    }),
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
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_email_verification_dto_1.RequestEmailVerificationDto]),
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
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_phone_verification_dto_1.RequestPhoneVerificationDto]),
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
__decorate([
    (0, common_1.Post)('update-daily-spin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update daily spin wheel count',
        description: 'Updates the daily spin wheel day count and sets the last spin timestamp. If daily_spin_wheel_last_spin is provided, it will be used; otherwise current time will be used.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daily spin updated successfully',
        type: update_daily_spin_dto_1.UpdateDailySpinResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_daily_spin_dto_1.UpdateDailySpinDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateDailySpin", null);
__decorate([
    (0, common_1.Post)('update-lucky-wheel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update lucky wheel count',
        description: 'Updates the lucky wheel count for the authenticated user',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lucky wheel count updated successfully',
        type: update_lucky_wheel_dto_1.UpdateLuckyWheelResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_lucky_wheel_dto_1.UpdateLuckyWheelDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateLuckyWheel", null);
__decorate([
    (0, common_1.Post)('update-daily-coins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update daily coins days count',
        description: 'Updates the daily coins days count and sets the last reward timestamp. If daily_coins_last_reward is provided, it will be used; otherwise current time will be used.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daily coins updated successfully',
        type: update_daily_coins_dto_1.UpdateDailyCoinsResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Authentication required',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_daily_coins_dto_1.UpdateDailyCoinsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateDailyCoins", null);
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
        rp_reward_event_service_1.RpRewardEventService,
        onesignal_service_1.OneSignalService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map