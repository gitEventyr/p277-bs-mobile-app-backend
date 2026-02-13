import { VoucherType } from '../../entities/voucher.entity';
export declare class CreateVoucherDto {
    name: string;
    rp_price: number;
    amazon_vouchers_equivalent: number;
    type: VoucherType;
}
