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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const email_interface_1 = require("../interfaces/email.interface");
const email_template_service_1 = require("./email-template.service");
const aws_ses_provider_1 = require("./aws-ses.provider");
const smtp_provider_1 = require("./smtp.provider");
const sendgrid_provider_1 = require("./sendgrid.provider");
let EmailService = EmailService_1 = class EmailService {
    configService;
    templateService;
    awsSESProvider;
    smtpProvider;
    sendGridProvider;
    logger = new common_1.Logger(EmailService_1.name);
    emailProvider;
    constructor(configService, templateService, awsSESProvider, smtpProvider, sendGridProvider) {
        this.configService = configService;
        this.templateService = templateService;
        this.awsSESProvider = awsSESProvider;
        this.smtpProvider = smtpProvider;
        this.sendGridProvider = sendGridProvider;
        this.initializeProvider();
    }
    initializeProvider() {
        const provider = this.configService.get('EMAIL_PROVIDER', 'smtp');
        switch (provider.toLowerCase()) {
            case 'aws':
            case 'ses':
                this.emailProvider = this.awsSESProvider;
                this.logger.log('Using AWS SES email provider');
                break;
            case 'sendgrid':
                this.emailProvider = this.sendGridProvider;
                this.logger.log('Using SendGrid email provider');
                break;
            case 'smtp':
            default:
                this.emailProvider = this.smtpProvider;
                this.logger.log('Using SMTP email provider');
                break;
        }
    }
    async sendEmail(options) {
        try {
            await this.emailProvider.sendEmail(options);
            this.logger.log(`Email sent successfully to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
        }
        catch (error) {
            this.logger.error('Failed to send email:', error);
            throw error;
        }
    }
    async sendTemplatedEmail(type, to, data, options) {
        const template = this.templateService.renderTemplate(type, data);
        if (!template) {
            throw new Error(`Failed to render email template: ${type}`);
        }
        const emailOptions = {
            to,
            subject: template.subject,
            html: template.html,
            text: template.text,
            ...options,
        };
        await this.sendEmail(emailOptions);
    }
    async sendDynamicTemplateEmail(templateId, to, dynamicTemplateData, options) {
        try {
            if (this.emailProvider.sendTemplateEmail) {
                await this.emailProvider.sendTemplateEmail(templateId, to, dynamicTemplateData, options);
            }
            else {
                throw new Error(`Dynamic templates not supported by current email provider`);
            }
            this.logger.log(`Dynamic template email sent successfully to: ${Array.isArray(to) ? to.join(', ') : to} using template: ${templateId}`);
        }
        catch (error) {
            this.logger.error('Failed to send dynamic template email:', error);
            throw error;
        }
    }
    async sendWelcomeEmail(to, userData) {
        const data = {
            name: userData.name || 'Player',
            email: userData.email,
            coinsBalance: userData.coinsBalance,
            ipAddress: userData.ipAddress,
            loginUrl: userData.loginUrl ||
                this.configService.get('FRONTEND_URL', 'http://localhost:3000'),
        };
        await this.sendTemplatedEmail(email_interface_1.EmailTemplateType.WELCOME, to, data);
    }
    async sendEmailVerification(to, userData) {
        const provider = this.configService.get('EMAIL_PROVIDER', 'smtp');
        if (provider.toLowerCase() === 'sendgrid') {
            const templateId = this.configService.get('SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID');
            if (templateId) {
                const dynamicData = {
                    resetCode: userData.resetCode,
                };
                await this.sendDynamicTemplateEmail(templateId, to, dynamicData);
                return;
            }
        }
        const data = {
            name: userData.name || 'Player',
            verificationUrl: userData.verificationUrl,
        };
        await this.sendTemplatedEmail(email_interface_1.EmailTemplateType.EMAIL_VERIFICATION, to, data);
    }
    async sendPasswordReset(to, userData) {
        const provider = this.configService.get('EMAIL_PROVIDER', 'smtp');
        if (provider.toLowerCase() === 'sendgrid') {
            const templateId = this.configService.get('SENDGRID_PASSWORD_RESET_TEMPLATE_ID');
            if (templateId) {
                const dynamicData = {
                    resetLink: userData.resetLink || userData.resetUrl,
                };
                await this.sendDynamicTemplateEmail(templateId, to, dynamicData);
                return;
            }
        }
        const data = {
            name: userData.name || 'Player',
            resetUrl: userData.resetUrl || userData.resetLink,
        };
        await this.sendTemplatedEmail(email_interface_1.EmailTemplateType.PASSWORD_RESET, to, data);
    }
    async verifyConnection() {
        try {
            return await this.emailProvider.verifyConnection();
        }
        catch (error) {
            this.logger.error('Email provider connection verification failed:', error);
            return false;
        }
    }
    async healthCheck() {
        const providerName = this.configService.get('EMAIL_PROVIDER', 'smtp');
        const connected = await this.verifyConnection();
        return {
            status: connected ? 'healthy' : 'unhealthy',
            provider: providerName,
            connected,
        };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_template_service_1.EmailTemplateService,
        aws_ses_provider_1.AWSSESProvider,
        smtp_provider_1.SMTPProvider,
        sendgrid_provider_1.SendGridProvider])
], EmailService);
//# sourceMappingURL=email.service.js.map