import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsNumber, Min } from 'class-validator';
import { UserVoucher } from './user-voucher.entity';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  cost: number;

  @Column({ type: 'varchar' })
  @IsString()
  provider: string;

  @Column({ type: 'varchar' })
  @IsString()
  img_url: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @OneToMany(() => UserVoucher, userVoucher => userVoucher.voucher)
  userVouchers: UserVoucher[];
}