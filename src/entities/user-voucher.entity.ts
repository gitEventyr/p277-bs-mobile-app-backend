import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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
  @ManyToOne('Player', (player: any) => player.userVouchers)
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('Voucher', (voucher: any) => voucher.userVouchers)
  @JoinColumn({ name: 'voucher_id' })
  voucher: any;
}
