"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PaymentValidationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidationService = void 0;
const common_1 = require("@nestjs/common");
let PaymentValidationService = PaymentValidationService_1 = class PaymentValidationService {
    logger = new common_1.Logger(PaymentValidationService_1.name);
    async validateIOSReceipt(receiptData, transactionId) {
        try {
            this.logger.log(`Validating iOS receipt for transaction: ${transactionId}`);
            if (!receiptData || typeof receiptData !== 'string') {
                throw new common_1.BadRequestException('Invalid receipt data format');
            }
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(receiptData)) {
                throw new common_1.BadRequestException('Receipt data must be base64 encoded');
            }
            this.logger.log(`iOS receipt validation completed for transaction: ${transactionId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`iOS receipt validation failed: ${error.message}`, error.stack);
            return false;
        }
    }
    async validateAndroidPurchase(purchaseToken, transactionId) {
        try {
            this.logger.log(`Validating Android purchase for transaction: ${transactionId}`);
            if (!purchaseToken || typeof purchaseToken !== 'string') {
                throw new common_1.BadRequestException('Invalid purchase token format');
            }
            this.logger.log(`Android purchase validation completed for transaction: ${transactionId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Android purchase validation failed: ${error.message}`, error.stack);
            return false;
        }
    }
    async validateReceipt(platform, receiptData, transactionId) {
        switch (platform.toLowerCase()) {
            case 'ios':
                return this.validateIOSReceipt(receiptData, transactionId);
            case 'android':
                return this.validateAndroidPurchase(receiptData, transactionId);
            default:
                throw new common_1.BadRequestException(`Unsupported platform: ${platform}`);
        }
    }
};
exports.PaymentValidationService = PaymentValidationService;
exports.PaymentValidationService = PaymentValidationService = PaymentValidationService_1 = __decorate([
    (0, common_1.Injectable)()
], PaymentValidationService);
//# sourceMappingURL=payment-validation.service.js.map