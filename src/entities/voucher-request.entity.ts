import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { Player } from './player.entity';
import { Voucher } from './voucher.entity';

export enum VoucherRequestStatus {
  REQUESTED = 'requested',
  SENT = 'sent',
  CANCELED = 'canceled',
}

@Entity('voucher_requests')
export class VoucherRequest {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'bigint' })
  voucher_id: number;

  @Column({ type: 'timestamp with time zone' })
  request_date: Date;

  @Column({
    type: 'enum',
    enum: VoucherRequestStatus,
    default: VoucherRequestStatus.REQUESTED,
  })
  @IsEnum(VoucherRequestStatus)
  status: VoucherRequestStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Player, (player) => player.voucherRequests)
  @JoinColumn({ name: 'user_id' })
  user: Player;

  @ManyToOne(() => Voucher, (voucher) => voucher.voucherRequests)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;
}
