import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Voucher } from './voucher.entity';

@Entity('users_vouchers')
export class UserVoucher {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'bigint' })
  voucher_id: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Player, (player) => player.userVouchers)
  @JoinColumn({ name: 'user_id' })
  user: Player;

  @ManyToOne(() => Voucher, (voucher) => voucher.userVouchers)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;
}
