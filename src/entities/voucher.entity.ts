import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { VoucherRequest } from './voucher-request.entity';

export enum VoucherType {
  AMAZON_GIFT_CARD = 'Amazon Gift Card',
  OTHER = 'Other',
}

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  @IsString()
  name: string;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  rp_price: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  amazon_vouchers_equivalent: number;

  @Column({ type: 'enum', enum: VoucherType })
  @IsEnum(VoucherType)
  type: VoucherType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @OneToMany(() => VoucherRequest, (voucherRequest) => voucherRequest.voucher)
  voucherRequests: VoucherRequest[];
}
