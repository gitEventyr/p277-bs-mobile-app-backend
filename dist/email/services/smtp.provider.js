"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SMTPProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let SMTPProvider = SMTPProvider_1 = class SMTPProvider {
    configService;
    logger = new common_1.Logger(SMTPProvider_1.name);
    transporter;
    defaultFromEmail;
    constructor(configService) {
        this.configService = configService;
        this.defaultFromEmail = this.configService.get('EMAIL_FROM', 'noreply@casino.com');
        this.createTransporter().catch((error) => {
            this.logger.error('Failed to create SMTP transporter during initialization:', error);
        });
    }
    async createTransporter() {
        const host = this.configService.get('SMTP_HOST');
        const port = this.configService.get('SMTP_PORT', 587);
        const secure = this.configService.get('SMTP_SECURE', false);
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        if (!host || !user || !pass) {
            this.logger.warn('No complete SMTP configuration found, using Ethereal for testing');
            await this.createTestTransporter();
            return;
        }
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        });
    }
    async createTestTransporter() {
        try {
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            this.logger.log(`Test email account created: ${testAccount.user}`);
        }
        catch (error) {
            this.logger.error('Failed to create test email account:', error);
            throw error;
        }
    }
    async sendEmail(options) {
        if (!this.transporter) {
            throw new Error('SMTP transporter not initialized. Email service may still be starting up.');
        }
        try {
            const mailOptions = {
                from: options.from || this.defaultFromEmail,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                attachments: options.attachments,
            };
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to: ${mailOptions.to}`);
            if (nodemailer.getTestMessageUrl(info)) {
                this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to send email via SMTP:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    async verifyConnection() {
        if (!this.transporter) {
            this.logger.warn('SMTP transporter not initialized yet');
            return false;
        }
        try {
            await this.transporter.verify();
            this.logger.log('SMTP connection verified successfully');
            return true;
        }
        catch (error) {
            this.logger.error('SMTP connection verification failed:', error);
            return false;
        }
    }
};
exports.SMTPProvider = SMTPProvider;
exports.SMTPProvider = SMTPProvider = SMTPProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SMTPProvider);
//# sourceMappingURL=smtp.provider.js.map