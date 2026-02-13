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
    async createEmailSubscription(visitorId, email) {
        if (!this.isConfigured()) {
            this.logger.warn('OneSignal API is not configured. Skipping email subscription creation.');
            return false;
        }
        try {
            const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}/subscriptions`;
            const payload = {
                subscription: {
                    type: 'Email',
                    token: email,
                },
            };
            this.logger.debug(`Creating email subscription for visitor ${visitorId}: ${email}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${this.apiKey}`,
                },
                timeout: 10000,
            }));
            this.logger.log(`Successfully created email subscription for visitor ${visitorId}: ${email}`, {
                statusCode: response.status,
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to create email subscription for visitor ${visitorId}: ${email}`, {
                error: error.message,
                statusCode: error.response?.status,
                response: error.response?.data,
            });
            return false;
        }
    }
    async sendTemplateEmail(templateId, visitorId, emailSubject, customData, email) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('OneSignal API is not configured');
        }
        if (email) {
            this.logger.debug(`Checking if email subscription already exists for visitor ${visitorId}: ${email}`);
            const userData = await this.getUserSubscriptions(visitorId);
            const emailSubscriptionExists = userData?.subscriptions?.some((sub) => sub.type === 'Email' &&
                sub.token?.toLowerCase() === email.toLowerCase());
            if (emailSubscriptionExists) {
                this.logger.debug(`Email subscription already exists for visitor ${visitorId}: ${email}`);
            }
            else {
                this.logger.debug(`Creating new email subscription for visitor ${visitorId}: ${email}`);
                await this.createEmailSubscription(visitorId, email);
            }
        }
        const payload = {
            app_id: this.appId,
            template_id: templateId,
            target_channel: 'email',
            email_subject: emailSubject,
            custom_data: customData,
            include_aliases: {
                external_id: [visitorId],
            },
        };
        this.logger.debug(`Sending email via visitor_id: ${visitorId}${email ? ` (to ${email})` : ''}`);
        await this.sendNotification(payload, 'email');
    }
    async createSMSSubscription(visitorId, phoneNumber) {
        if (!this.isConfigured()) {
            this.logger.warn('OneSignal API is not configured. Skipping SMS subscription creation.');
            return false;
        }
        try {
            const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}/subscriptions`;
            const payload = {
                subscription: {
                    type: 'SMS',
                    token: phoneNumber,
                },
            };
            this.logger.debug(`Creating SMS subscription for visitor ${visitorId}: ${phoneNumber}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${this.apiKey}`,
                },
                timeout: 10000,
            }));
            this.logger.log(`Successfully created SMS subscription for visitor ${visitorId}: ${phoneNumber}`, {
                statusCode: response.status,
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to create SMS subscription for visitor ${visitorId}: ${phoneNumber}`, {
                error: error.message,
                statusCode: error.response?.status,
                response: error.response?.data,
            });
            return false;
        }
    }
    async sendTemplateSMS(templateId, visitorId, customData, phoneNumber) {
        if (!this.isConfigured()) {
            throw new common_1.BadRequestException('OneSignal API is not configured');
        }
        if (phoneNumber) {
            this.logger.debug(`Checking if SMS subscription already exists for visitor ${visitorId}: ${phoneNumber}`);
            const userData = await this.getUserSubscriptions(visitorId);
            const smsSubscriptionExists = userData?.subscriptions?.some((sub) => sub.type === 'SMS' && sub.token === phoneNumber);
            if (smsSubscriptionExists) {
                this.logger.debug(`SMS subscription already exists for visitor ${visitorId}: ${phoneNumber}`);
            }
            else {
                this.logger.debug(`Creating new SMS subscription for visitor ${visitorId}: ${phoneNumber}`);
                await this.createSMSSubscription(visitorId, phoneNumber);
            }
        }
        const payload = {
            app_id: this.appId,
            template_id: templateId,
            target_channel: 'sms',
            custom_data: customData,
            include_aliases: {
                external_id: [visitorId],
            },
        };
        this.logger.debug(`Sending SMS via visitor_id: ${visitorId}${phoneNumber ? ` (to ${phoneNumber})` : ''}`);
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
        }, email);
    }
    async sendEmailVerificationCode(visitorId, verificationCode, email) {
        const templateId = this.configService.get('EMAIL_VALIDATION_OTP_TEMPLATE_ID');
        if (!templateId) {
            throw new common_1.BadRequestException('EMAIL_VALIDATION_OTP_TEMPLATE_ID is not configured');
        }
        this.logger.log(`Sending email verification code to visitor ${visitorId}${email ? ` (${email})` : ''}`);
        await this.sendTemplateEmail(templateId, visitorId, 'Verify Your Email Address', {
            verification_code: verificationCode,
        }, email);
    }
    async sendPhoneVerificationCode(visitorId, verificationCode, phoneNumber) {
        const templateId = this.configService.get('SMS_BONUS_SPINS_OTP_TEMPLATE_ID');
        if (!templateId) {
            throw new common_1.BadRequestException('SMS_BONUS_SPINS_OTP_TEMPLATE_ID is not configured');
        }
        this.logger.log(`Sending phone verification code to visitor ${visitorId}${phoneNumber ? ` (${phoneNumber})` : ''}`);
        await this.sendTemplateSMS(templateId, visitorId, {
            verification_code: verificationCode,
        }, phoneNumber);
    }
    async updateUserTags(visitorId, tags) {
        if (!this.isConfigured()) {
            this.logger.warn('OneSignal API is not configured. Skipping tag update.');
            return false;
        }
        try {
            const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}`;
            const payload = {
                properties: {
                    tags,
                },
            };
            this.logger.debug(`Updating OneSignal tags for visitor ${visitorId}`, {
                tagCount: Object.keys(tags).length,
                tags,
            });
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${this.apiKey}`,
                },
                timeout: 10000,
            }));
            this.logger.log(`Successfully updated OneSignal tags for visitor ${visitorId}`, {
                statusCode: response.status,
                tagCount: Object.keys(tags).length,
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to update OneSignal tags for visitor ${visitorId}`, {
                error: error.message,
                statusCode: error.response?.status,
                response: error.response?.data,
                tags,
            });
            return false;
        }
    }
    async getUserSubscriptions(visitorId) {
        if (!this.isConfigured()) {
            this.logger.warn('OneSignal API is not configured. Cannot fetch user subscriptions.');
            return null;
        }
        try {
            const apiUrl = `https://api.onesignal.com/apps/${this.appId}/users/by/external_id/${encodeURIComponent(visitorId)}`;
            this.logger.debug(`Fetching OneSignal subscriptions for visitor ${visitorId}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${this.apiKey}`,
                },
                timeout: 10000,
            }));
            this.logger.log(`Successfully fetched OneSignal user data for visitor ${visitorId}`, {
                subscriptionCount: response.data.subscriptions?.length || 0,
            });
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                this.logger.warn(`User not found in OneSignal: visitor ${visitorId}`);
                return null;
            }
            this.logger.error(`Failed to fetch OneSignal subscriptions for visitor ${visitorId}`, {
                error: error.message,
                statusCode: error.response?.status,
                response: error.response?.data,
            });
            return null;
        }
    }
    async disableSubscription(tokenType, token) {
        if (!this.isConfigured()) {
            this.logger.warn('OneSignal API is not configured. Skipping subscription disable.');
            return false;
        }
        try {
            const apiUrl = `https://api.onesignal.com/apps/${this.appId}/subscriptions_by_token/${tokenType}/${encodeURIComponent(token)}`;
            const payload = {
                subscription: {
                    enabled: false,
                    notification_types: -31,
                },
            };
            this.logger.debug(`Disabling OneSignal ${tokenType} subscription for: ${token}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Key ${this.apiKey}`,
                },
                timeout: 10000,
            }));
            this.logger.log(`Successfully disabled OneSignal ${tokenType} subscription for: ${token}`, {
                statusCode: response.status,
            });
            return true;
        }
        catch (error) {
            if (error.response?.status === 404) {
                this.logger.debug(`Subscription not found in OneSignal (may not exist yet): ${tokenType} ${token}`);
                return false;
            }
            this.logger.error(`Failed to disable OneSignal ${tokenType} subscription for: ${token}`, {
                error: error.message,
                statusCode: error.response?.status,
                response: error.response?.data,
            });
            return false;
        }
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
                recipient_count: payload.include_aliases
                    ? payload.include_aliases.external_id.length
                    : payload.include_email_tokens
                        ? payload.include_email_tokens.length
                        : payload.include_phone_numbers
                            ? payload.include_phone_numbers.length
                            : 0,
                targeting_method: payload.include_email_tokens
                    ? 'email_tokens'
                    : payload.include_phone_numbers
                        ? 'phone_numbers'
                        : 'external_id',
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