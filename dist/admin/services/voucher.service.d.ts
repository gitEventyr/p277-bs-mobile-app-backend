import { Repository } from 'typeorm';
import { Voucher } from '../../entities/voucher.entity';
import { VoucherRequest } from '../../entities/voucher-request.entity';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { UpdateVoucherDto } from '../dto/update-voucher.dto';
import { UpdateVoucherRequestDto } from '../dto/update-voucher-request.dto';
export declare class VoucherService {
    private voucherRepository;
    private voucherRequestRepository;
    constructor(voucherRepository: Repository<Voucher>, voucherRequestRepository: Repository<VoucherRequest>);
    createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher>;
    findAllVouchers(): Promise<Voucher[]>;
    findVoucherById(id: number): Promise<Voucher>;
    updateVoucher(id: number, updateVoucherDto: UpdateVoucherDto): Promise<Voucher>;
    removeVoucher(id: number): Promise<void>;
    findAllVoucherRequests(): Promise<VoucherRequest[]>;
    findVoucherRequestById(id: number): Promise<VoucherRequest>;
    updateVoucherRequest(id: number, updateVoucherRequestDto: UpdateVoucherRequestDto): Promise<VoucherRequest>;
    removeVoucherRequest(id: number): Promise<void>;
}
