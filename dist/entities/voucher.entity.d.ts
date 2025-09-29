import { VoucherRequest } from './voucher-request.entity';
export declare enum VoucherType {
    AMAZON_GIFT_CARD = "Amazon Gift Card",
    OTHER = "Other"
}
export declare class Voucher {
    id: number;
    name: string;
    rp_price: number;
    amazon_vouchers_equivalent: number;
    type: VoucherType;
    created_at: Date;
    updated_at: Date;
    voucherRequests: VoucherRequest[];
}
