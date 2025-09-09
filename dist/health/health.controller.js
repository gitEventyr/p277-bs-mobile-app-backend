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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const email_service_1 = require("../email/services/email.service");
let HealthController = class HealthController {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async check() {
        const emailHealth = await this.emailService.healthCheck();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {
                email: emailHealth,
            },
        };
    }
    async checkEmail() {
        return await this.emailService.healthCheck();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('email'),
    (0, swagger_1.ApiOperation)({ summary: 'Email service health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email service health status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkEmail", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('🔧 System: Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], HealthController);
//# sourceMappingURL=health.controller.js.map