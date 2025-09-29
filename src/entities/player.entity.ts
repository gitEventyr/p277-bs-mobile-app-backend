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

  @Column({ type: 'double precision', default: 0 })
  @IsNumber()
  @Min(0)
  rp_balance: number;

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

  // Device and agreement fields
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  device_udid?: string;

  @Column({ type: 'boolean', nullable: true })
  @IsOptional()
  @IsBoolean()
  subscription_agreement?: boolean;

  @Column({ type: 'boolean', nullable: true })
  @IsOptional()
  @IsBoolean()
  tnc_agreement?: boolean;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  os?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  device?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  // Email verification fields
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  email_verified: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsOptional()
  email_verified_at?: Date;

  // Phone verification fields
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  phone_verified: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsOptional()
  phone_verified_at?: Date;

  // Soft delete fields
  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  is_deleted: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsOptional()
  deleted_at?: Date;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  deletion_reason?: string;

  // Relationships
  @OneToMany('Device', (device: any) => device.user)
  devices: any[];

  @OneToMany('CoinsBalanceChange', (change: any) => change.user)
  balanceChanges: any[];

  @OneToMany('RpBalanceTransaction', (transaction: any) => transaction.user)
  rpBalanceTransactions: any[];

  @OneToMany('PlayHistory', (play: any) => play.user)
  playHistory: any[];

  @OneToMany('InAppPurchase', (purchase: any) => purchase.user)
  purchases: any[];

  @OneToMany('VoucherRequest', (voucherRequest: any) => voucherRequest.user)
  voucherRequests: any[];

  @OneToMany('CasinoAction', (casinoAction: any) => casinoAction.player)
  casinoActions: any[];
}
