import { Repository, DataSource } from 'typeorm';
import { Voucher } from '../../entities/voucher.entity';
import { VoucherRequest } from '../../entities/voucher-request.entity';
import { Player } from '../../entities/player.entity';
import { RpBalanceTransaction } from '../../entities/rp-balance-transaction.entity';
export declare class VoucherService {
    private readonly voucherRepository;
    private readonly voucherRequestRepository;
    private readonly playerRepository;
    private readonly rpTransactionRepository;
    private readonly dataSource;
    constructor(voucherRepository: Repository<Voucher>, voucherRequestRepository: Repository<VoucherRequest>, playerRepository: Repository<Player>, rpTransactionRepository: Repository<RpBalanceTransaction>, dataSource: DataSource);
    findAllVouchers(): Promise<Voucher[]>;
    createVoucherRequest(userId: number, voucherId: number): Promise<{
        voucherRequest: VoucherRequest;
        rpTransaction: any;
    }>;
}
