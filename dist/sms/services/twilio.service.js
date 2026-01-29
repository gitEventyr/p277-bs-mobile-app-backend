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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TwilioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const twilio_1 = __importDefault(require("twilio"));
const phone_verification_token_entity_1 = require("../../entities/phone-verification-token.entity");
const onesignal_service_1 = require("../../external/onesignal/onesignal.service");
let TwilioService = TwilioService_1 = class TwilioService {
    configService;
    phoneVerificationTokenRepository;
    oneSignalService;
    logger = new common_1.Logger(TwilioService_1.name);
    client;
    verifyServiceSid;
    constructor(configService, phoneVerificationTokenRepository, oneSignalService) {
        this.configService = configService;
        this.phoneVerificationTokenRepository = phoneVerificationTokenRepository;
        this.oneSignalService = oneSignalService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.verifyServiceSid = this.configService.get('TWILIO_VERIFY_SERVICE_SID', '');
        if (!accountSid || !authToken || !this.verifyServiceSid) {
            this.logger.warn('Twilio Verify credentials not configured - SMS functionality will be disabled');
        }
        else {
            this.client = (0, twilio_1.default)(accountSid, authToken);
            this.logger.log('Twilio Verify service initialized');
        }
    }
    async sendVerificationCode(phoneNumber, userId) {
        const smsProvider = this.configService.get('SMS_PROVIDER', 'twilio');
        if (smsProvider.toLowerCase() === 'onesignal') {
            if (!userId) {
                throw new common_1.BadRequestException('User ID is required for OneSignal SMS verification');
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            await this.phoneVerificationTokenRepository.save({
                token: verificationCode,
                user_id: userId,
                expires_at: expiresAt,
                used: false,
            });
            try {
                await this.oneSignalService.sendPhoneVerificationCode(phoneNumber, verificationCode);
                this.logger.log(`OneSignal verification code sent successfully to ${phoneNumber}`);
            }
            catch (error) {
                this.logger.error(`Failed to send verification code via OneSignal to ${phoneNumber}:`, error);
                throw new common_1.BadRequestException('Failed to send verification code. Please try again later.');
            }
            return;
        }
        if (!this.client || !this.verifyServiceSid) {
            this.logger.warn('Twilio Verify not configured - SMS verification not sent');
            return;
        }
        try {
            const verification = await this.client.verify.v2
                .services(this.verifyServiceSid)
                .verifications.create({
                to: phoneNumber,
                channel: 'sms',
            });
            this.logger.log(`Verification code sent successfully to ${phoneNumber}, SID: ${verification.sid}, Status: ${verification.status}`);
        }
        catch (error) {
            this.logger.error(`Failed to send verification code to ${phoneNumber}:`, error);
            throw new common_1.BadRequestException('Failed to send verification code. Please check the phone number format.');
        }
    }
    async verifyCode(phoneNumber, code, userId) {
        const smsProvider = this.configService.get('SMS_PROVIDER', 'twilio');
        if (smsProvider.toLowerCase() === 'onesignal') {
            if (!userId) {
                this.logger.error('User ID is required for OneSignal code verification');
                return false;
            }
            try {
                const token = await this.phoneVerificationTokenRepository.findOne({
                    where: {
                        user_id: userId,
                        token: code,
                        used: false,
                    },
                    order: {
                        created_at: 'DESC',
                    },
                });
                if (!token) {
                    this.logger.log(`No matching verification token found for user ${userId}`);
                    return false;
                }
                if (new Date() > token.expires_at) {
                    this.logger.log(`Verification token expired for user ${userId}`);
                    return false;
                }
                token.used = true;
                await this.phoneVerificationTokenRepository.save(token);
                this.logger.log(`Verification code successfully verified for ${phoneNumber} (OneSignal)`);
                return true;
            }
            catch (error) {
                this.logger.error(`Failed to verify code for ${phoneNumber} (OneSignal):`, error);
                return false;
            }
        }
        if (!this.client || !this.verifyServiceSid) {
            this.logger.warn('Twilio Verify not configured - code verification failed');
            return false;
        }
        try {
            const verificationCheck = await this.client.verify.v2
                .services(this.verifyServiceSid)
                .verificationChecks.create({
                to: phoneNumber,
                code: code,
            });
            this.logger.log(`Verification check for ${phoneNumber}: Status: ${verificationCheck.status}`);
            return verificationCheck.status === 'approved';
        }
        catch (error) {
            this.logger.error(`Failed to verify code for ${phoneNumber}:`, error);
            return false;
        }
    }
};
exports.TwilioService = TwilioService;
exports.TwilioService = TwilioService = TwilioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(phone_verification_token_entity_1.PhoneVerificationToken)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        onesignal_service_1.OneSignalService])
], TwilioService);
//# sourceMappingURL=twilio.service.js.map