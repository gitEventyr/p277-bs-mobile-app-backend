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
var OneSignalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneSignalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let OneSignalService = OneSignalService_1 = class OneSignalService {
    configService;
    httpService;
    logger = new common_1.Logger(OneSignalService_1.name);
    apiBaseUrl = 'https://api.onesignal.com/notifications';
    appId;
    apiKey;
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.appId = this.configService.get('ONE_SIGNAL_APP_ID');
        this.apiKey = this.configService.get('ONE_SIGNAL_API_KEY');
        if (!this.appId || !this.apiKey) {
            this.logger.warn('OneSignal API configuration is incomplete. OneSignal notifications will be disabled.');
        }
    }
    async sendTemplateEmail(templateId, visitorId, emailSubject, customData) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('OneSignal API is not configured');
        }
        const payload = {
            app_id: this.appId,
            template_id: templateId,
            include_aliases: {
                external_id: [visitorId],
            },
            target_channel: 'email',
            email_subject: emailSubject,
            custom_data: customData,
        };
        await this.sendNotification(payload, 'email');
    }
    async sendTemplateSMS(templateId, visitorId, customData) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('OneSignal API is not configured');
        }
        const payload = {
            app_id: this.appId,
            template_id: templateId,
            include_aliases: {
                external_id: [visitorId],
            },
            target_channel: 'sms',
            custom_data: customData,
            contents: { en: 'SMS notification' },
        };
        await this.sendNotification(payload, 'SMS');
    }
    async sendPasswordResetEmail(visitorId, resetLink, email) {
        const templateId = this.configService.get('EMAIL_PASSWORD_RESET_TEMPLATE_ID');
        if (!templateId) {
            throw new common_1.BadRequestException('EMAIL_PASSWORD_RESET_TEMPLATE_ID is not configured');
        }
        this.logger.log(`Sending password reset email to visitor ${visitorId}${email ? ` (${email})` : ''}`);
        await this.sendTemplateEmail(templateId, visitorId, 'Reset Your Password', {
            reset_link: resetLink,
        });
    }
    async sendEmailVerificationCode(visitorId, verificationCode, email) {
        const templateId = this.configService.get('EMAIL_VALIDATION_OTP_TEMPLATE_ID');
        if (!templateId) {
            throw new common_1.BadRequestException('EMAIL_VALIDATION_OTP_TEMPLATE_ID is not configured');
        }
        this.logger.log(`Sending email verification code to visitor ${visitorId}${email ? ` (${email})` : ''}`);
        await this.sendTemplateEmail(templateId, visitorId, 'Verify Your Email Address', {
            verification_code: verificationCode,
        });
    }
    async sendPhoneVerificationCode(visitorId, verificationCode, phoneNumber) {
        const templateId = this.configService.get('SMS_BONUS_SPINS_OTP_TEMPLATE_ID');
        if (!templateId) {
            throw new common_1.BadRequestException('SMS_BONUS_SPINS_OTP_TEMPLATE_ID is not configured');
        }
        this.logger.log(`Sending phone verification code to visitor ${visitorId}${phoneNumber ? ` (${phoneNumber})` : ''}`);
        await this.sendTemplateSMS(templateId, visitorId, {
            verification_code: verificationCode,
        });
    }
    async verifyConnection() {
        return this.isConfigured();
    }
    isConfigured() {
        return !!(this.appId && this.apiKey);
    }
    async sendNotification(payload, type) {
        try {
            const apiUrl = `${this.apiBaseUrl}?c=${payload.target_channel}`;
            const maskedApiKey = this.apiKey
                ? `${this.apiKey.substring(0, 10)}...`
                : 'not configured';
            this.logger.debug(`Calling OneSignal API: ${apiUrl} (API Key: ${maskedApiKey})`, {
                template_id: payload.template_id,
                target_channel: payload.target_channel,
                recipient_count: payload.include_aliases.external_id.length,
            });
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${this.apiKey}`,
                },
                timeout: 10000,
            }));
            const responseData = response.data;
            if ('errors' in responseData) {
                throw new common_1.BadRequestException(`OneSignal API error: ${responseData.errors.join(', ')}`);
            }
            this.logger.log(`Successfully sent ${type} notification via OneSignal. Notification ID: ${responseData.id}`);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                this.logger.error(`Failed to send ${type} notification via OneSignal`, {
                    error: error.message,
                    template_id: payload.template_id,
                    target_channel: payload.target_channel,
                });
                throw error;
            }
            this.logger.error(`Failed to send ${type} notification via OneSignal`, {
                error: error.message,
                template_id: payload.template_id,
                target_channel: payload.target_channel,
                response: error.response?.data,
            });
            if (error.response?.status >= 400 && error.response?.status < 500) {
                throw new common_1.BadRequestException(`OneSignal API error: ${error.response?.data?.errors?.join(', ') || error.message}`);
            }
            throw new common_1.BadRequestException(`Unable to send ${type} notification. Please try again later.`);
        }
    }
};
exports.OneSignalService = OneSignalService;
exports.OneSignalService = OneSignalService = OneSignalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], OneSignalService);
//# sourceMappingURL=onesignal.service.js.map