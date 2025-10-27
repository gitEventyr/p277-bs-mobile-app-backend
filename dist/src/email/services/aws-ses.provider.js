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
var AWSSESProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSSESProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_ses_1 = require("@aws-sdk/client-ses");
let AWSSESProvider = AWSSESProvider_1 = class AWSSESProvider {
    configService;
    logger = new common_1.Logger(AWSSESProvider_1.name);
    sesClient;
    defaultFromEmail;
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION', 'us-east-1');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const config = {
            region,
        };
        if (accessKeyId && secretAccessKey) {
            config.credentials = {
                accessKeyId,
                secretAccessKey,
            };
        }
        this.sesClient = new client_ses_1.SESClient(config);
        this.defaultFromEmail = this.configService.get('EMAIL_FROM', 'noreply@casino.com');
    }
    async sendEmail(options) {
        try {
            const recipients = Array.isArray(options.to) ? options.to : [options.to];
            const params = {
                Source: options.from || this.defaultFromEmail,
                Destination: {
                    ToAddresses: recipients,
                },
                Message: {
                    Subject: {
                        Data: options.subject,
                        Charset: 'UTF-8',
                    },
                    Body: {
                        Html: options.html
                            ? {
                                Data: options.html,
                                Charset: 'UTF-8',
                            }
                            : undefined,
                        Text: options.text
                            ? {
                                Data: options.text,
                                Charset: 'UTF-8',
                            }
                            : undefined,
                    },
                },
            };
            const command = new client_ses_1.SendEmailCommand(params);
            await this.sesClient.send(command);
            this.logger.log(`Email sent successfully to: ${recipients.join(', ')}`);
        }
        catch (error) {
            this.logger.error('Failed to send email via AWS SES:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    async verifyConnection() {
        try {
            return true;
        }
        catch (error) {
            this.logger.error('AWS SES connection verification failed:', error);
            return false;
        }
    }
};
exports.AWSSESProvider = AWSSESProvider;
exports.AWSSESProvider = AWSSESProvider = AWSSESProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AWSSESProvider);
//# sourceMappingURL=aws-ses.provider.js.map