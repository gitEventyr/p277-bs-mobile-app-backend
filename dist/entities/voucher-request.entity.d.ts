import { Player } from './player.entity';
import { Voucher } from './voucher.entity';
export declare enum VoucherRequestStatus {
    REQUESTED = "requested",
    SENT = "sent",
    CANCELED = "canceled"
}
export declare class VoucherRequest {
    id: number;
    user_id: number;
    voucher_id: number;
    request_date: Date;
    status: VoucherRequestStatus;
    created_at: Date;
    updated_at: Date;
    user: Player;
    voucher: Voucher;
}
