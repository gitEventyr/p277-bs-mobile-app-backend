export declare class PaymentValidationService {
    private readonly logger;
    validateIOSReceipt(receiptData: string, transactionId: string): Promise<boolean>;
    validateAndroidPurchase(purchaseToken: string, transactionId: string): Promise<boolean>;
    validateReceipt(platform: string, receiptData: string, transactionId: string): Promise<boolean>;
}
