import { VoucherService } from '../services/voucher.service';
import { CreateVoucherRequestDto } from '../dto/create-voucher-request.dto';
import type { AuthenticatedUser } from '../../common/types/auth.types';
export declare class VouchersController {
    private readonly voucherService;
    constructor(voucherService: VoucherService);
    findAllVouchers(): Promise<import("../../entities/voucher.entity").Voucher[]>;
    createVoucherRequest(user: AuthenticatedUser, createVoucherRequestDto: CreateVoucherRequestDto): Promise<{
        voucherRequest: import("../../entities/voucher-request.entity").VoucherRequest;
        rpTransaction: any;
    }>;
}
