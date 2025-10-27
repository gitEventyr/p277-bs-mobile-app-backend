import { VoucherService } from '../services/voucher.service';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { UpdateVoucherDto } from '../dto/update-voucher.dto';
import { UpdateVoucherRequestDto } from '../dto/update-voucher-request.dto';
export declare class VoucherController {
    private readonly voucherService;
    constructor(voucherService: VoucherService);
    createVoucher(createVoucherDto: CreateVoucherDto): Promise<import("../../entities/voucher.entity").Voucher>;
    findAllVouchers(): Promise<import("../../entities/voucher.entity").Voucher[]>;
    findVoucherById(id: number): Promise<import("../../entities/voucher.entity").Voucher>;
    updateVoucher(id: number, updateVoucherDto: UpdateVoucherDto): Promise<import("../../entities/voucher.entity").Voucher>;
    removeVoucher(id: number): Promise<void>;
    findAllVoucherRequests(): Promise<import("../../entities/voucher-request.entity").VoucherRequest[]>;
    findVoucherRequestById(id: number): Promise<import("../../entities/voucher-request.entity").VoucherRequest>;
    updateVoucherRequest(id: number, updateVoucherRequestDto: UpdateVoucherRequestDto): Promise<import("../../entities/voucher-request.entity").VoucherRequest>;
    removeVoucherRequest(id: number): Promise<void>;
}
