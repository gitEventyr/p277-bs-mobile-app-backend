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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SendGridProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mail_1 = __importDefault(require("@sendgrid/mail"));
let SendGridProvider = SendGridProvider_1 = class SendGridProvider {
    configService;
    logger = new common_1.Logger(SendGridProvider_1.name);
    defaultFromEmail;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        if (apiKey) {
            mail_1.default.setApiKey(apiKey);
            this.logger.log('SendGrid API key configured successfully');
        }
        else {
            this.logger.warn('SendGrid API key not provided');
        }
        this.defaultFromEmail = this.configService.get('EMAIL_FROM', 'noreply@casino.com');
    }
    async sendEmail(options) {
        try {
            const recipients = Array.isArray(options.to) ? options.to : [options.to];
            const msg = {
                to: recipients,
                from: options.from || this.defaultFromEmail,
                subject: options.subject,
            };
            if (options.text) {
                msg.text = options.text;
            }
            if (options.html) {
                msg.html = options.html;
            }
            if (options.attachments && options.attachments.length > 0) {
                msg.attachments = options.attachments.map((attachment) => ({
                    content: attachment.content.toString('base64'),
                    filename: attachment.filename,
                    type: attachment.contentType || 'application/octet-stream',
                    disposition: 'attachment',
                }));
            }
            await mail_1.default.send(msg);
            this.logger.log(`Email sent successfully to: ${recipients.join(', ')}`);
        }
        catch (error) {
            this.logger.error('Failed to send email via SendGrid:', error);
            let errorMessage = error.message;
            if (error.response?.body?.errors) {
                errorMessage = error.response.body.errors
                    .map((err) => err.message)
                    .join(', ');
            }
            throw new Error(`Failed to send email: ${errorMessage}`);
        }
    }
    async sendTemplateEmail(templateId, to, dynamicTemplateData, options) {
        try {
            const recipients = Array.isArray(to) ? to : [to];
            const msg = {
                to: recipients,
                from: options?.from || this.defaultFromEmail,
                templateId,
                dynamicTemplateData,
            };
            if (options?.subject) {
                msg.subject = options.subject;
            }
            if (options?.attachments && options.attachments.length > 0) {
                msg.attachments = options.attachments.map((attachment) => ({
                    content: attachment.content.toString('base64'),
                    filename: attachment.filename,
                    type: attachment.contentType || 'application/octet-stream',
                    disposition: 'attachment',
                }));
            }
            await mail_1.default.send(msg);
            this.logger.log(`Template email sent successfully to: ${recipients.join(', ')} using template: ${templateId}`);
        }
        catch (error) {
            this.logger.error('Failed to send template email via SendGrid:', error);
            let errorMessage = error.message;
            if (error.response?.body?.errors) {
                errorMessage = error.response.body.errors
                    .map((err) => err.message)
                    .join(', ');
            }
            throw new Error(`Failed to send template email: ${errorMessage}`);
        }
    }
    async verifyConnection() {
        try {
            const apiKey = this.configService.get('SENDGRID_API_KEY');
            if (!apiKey) {
                this.logger.warn('SendGrid API key not configured');
                return false;
            }
            const isValidFormat = apiKey.startsWith('SG.');
            if (isValidFormat) {
                this.logger.log('SendGrid connection verified successfully');
                return true;
            }
            else {
                this.logger.warn('SendGrid API key format appears invalid');
                return false;
            }
        }
        catch (error) {
            this.logger.error('SendGrid connection verification failed:', error);
            return false;
        }
    }
};
exports.SendGridProvider = SendGridProvider;
exports.SendGridProvider = SendGridProvider = SendGridProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendGridProvider);
//# sourceMappingURL=sendgrid.provider.js.map