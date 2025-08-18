import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsEmail,
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  Min,
} from 'class-validator';
import { Device } from './device.entity';
import { CoinsBalanceChange } from './coins-balance-change.entity';
import { PlayHistory } from './play-history.entity';
import { InAppPurchase } from './in-app-purchase.entity';
import { UserVoucher } from './user-voucher.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  visitor_id: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Column({ type: 'text', nullable: true, select: false })
  @IsOptional()
  @IsString()
  password?: string;

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  @Min(0)
  coins_balance: number;

  @Column({ type: 'integer', default: 1 })
  @IsNumber()
  @Min(1)
  level: number;

  // AppsFlyer attribution fields
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  pid?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  c?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_channel?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_adset?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_ad?: string;

  @Column({ type: 'text', array: true, nullable: true })
  @IsOptional()
  af_keywords?: string[];

  @Column({ type: 'boolean', nullable: true })
  @IsOptional()
  @IsBoolean()
  is_retargeting?: boolean;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber()
  af_click_lookback?: number;

  @Column({ type: 'smallint', nullable: true })
  @IsOptional()
  @IsNumber()
  af_viewthrough_lookback?: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_sub1?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_sub2?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_sub3?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_sub4?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  af_sub5?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsString()
  auth_user_id?: string;

  @Column({ type: 'boolean', nullable: true })
  @IsOptional()
  @IsBoolean()
  age_checkbox?: boolean;

  @Column({ type: 'integer', default: 0 })
  @IsNumber()
  @Min(0)
  scratch_cards: number;

  // Relationships
  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => CoinsBalanceChange, (change) => change.user)
  balanceChanges: CoinsBalanceChange[];

  @OneToMany(() => PlayHistory, (play) => play.user)
  playHistory: PlayHistory[];

  @OneToMany(() => InAppPurchase, (purchase) => purchase.user)
  purchases: InAppPurchase[];

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.user)
  userVouchers: UserVoucher[];
}
