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
var EmailTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateService = void 0;
const common_1 = require("@nestjs/common");
const handlebars = __importStar(require("handlebars"));
const email_interface_1 = require("../interfaces/email.interface");
let EmailTemplateService = EmailTemplateService_1 = class EmailTemplateService {
    logger = new common_1.Logger(EmailTemplateService_1.name);
    templates = new Map();
    constructor() {
        this.loadTemplates();
    }
    loadTemplates() {
        this.templates.set(email_interface_1.EmailTemplateType.WELCOME, {
            subject: 'Welcome to Our Casino! 🎰',
            html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Casino!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your gaming adventure starts here</p>
          </div>
          <div style="padding: 40px 20px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to our exciting casino platform! We're thrilled to have you join our community of players.
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">Your Account Details:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> {{email}}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Starting Balance:</strong> {{coinsBalance}} coins</p>
              <p style="margin: 5px 0; color: #666;"><strong>IP Address:</strong> {{ipAddress}}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Start playing your favorite games and enjoy the thrill of winning big!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="{{loginUrl}}" style="background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Start Playing Now
              </a>
            </div>
          </div>
          <div style="background-color: #e9ecef; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent to {{email}}. If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      `,
            text: `
Welcome to Our Casino!

Hello {{name}}!

Welcome to our exciting casino platform! We're thrilled to have you join our community of players.

Your Account Details:
- Email: {{email}}
- Starting Balance: {{coinsBalance}} coins
- IP Address: {{ipAddress}}

Start playing your favorite games and enjoy the thrill of winning big!

Visit: {{loginUrl}} to start playing now.

This email was sent to {{email}}. If you didn't create an account, please ignore this email.
      `,
        });
        this.templates.set(email_interface_1.EmailTemplateType.EMAIL_VERIFICATION, {
            subject: 'Verify Your Email Address',
            html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
          </div>
          <div style="padding: 40px 20px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Please verify your email address to complete your account setup.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{verificationUrl}}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all; color: #667eea;">{{verificationUrl}}</span>
            </p>
          </div>
          <div style="background-color: #e9ecef; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This verification link will expire in 24 hours.</p>
          </div>
        </div>
      `,
            text: `
Verify Your Email Address

Hello {{name}}!

Please verify your email address to complete your account setup.

Verification link: {{verificationUrl}}

This verification link will expire in 24 hours.
      `,
        });
        this.templates.set(email_interface_1.EmailTemplateType.PASSWORD_RESET, {
            subject: 'Reset Your Password',
            html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
          </div>
          <div style="padding: 40px 20px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all; color: #dc3545;">{{resetUrl}}</span>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="background-color: #e9ecef; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This password reset link will expire in 1 hour.</p>
          </div>
        </div>
      `,
            text: `
Reset Your Password

Hello {{name}}!

We received a request to reset your password. Use the link below to create a new password:

{{resetUrl}}

If you didn't request this password reset, you can safely ignore this email.

This password reset link will expire in 1 hour.
      `,
        });
        this.logger.log(`Loaded ${this.templates.size} email templates`);
    }
    getTemplate(type) {
        return this.templates.get(type);
    }
    renderTemplate(type, data) {
        const template = this.templates.get(type);
        if (!template) {
            this.logger.error(`Template not found: ${type}`);
            return null;
        }
        try {
            const subjectTemplate = handlebars.compile(template.subject);
            const htmlTemplate = handlebars.compile(template.html);
            const textTemplate = template.text
                ? handlebars.compile(template.text)
                : null;
            return {
                subject: subjectTemplate(data),
                html: htmlTemplate(data),
                text: textTemplate ? textTemplate(data) : undefined,
            };
        }
        catch (error) {
            this.logger.error(`Failed to render template ${type}:`, error);
            return null;
        }
    }
    getAllTemplateTypes() {
        return Array.from(this.templates.keys());
    }
};
exports.EmailTemplateService = EmailTemplateService;
exports.EmailTemplateService = EmailTemplateService = EmailTemplateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailTemplateService);
//# sourceMappingURL=email-template.service.js.map