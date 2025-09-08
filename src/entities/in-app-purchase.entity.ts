import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsString, IsNumber, Min } from 'class-validator';

@Entity('in_app_purchases')
export class InAppPurchase {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'text' })
  @IsString()
  platform: string; // 'ios' or 'android'

  @Column({ type: 'text' })
  @IsString()
  product_id: string;

  @Column({ type: 'text', unique: true })
  @IsString()
  transaction_id: string;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  amount: number;

  @Column({ type: 'text', default: 'USD' })
  @IsString()
  currency: string;

  @Column({ type: 'timestamp with time zone' })
  purchased_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne('Player', (player: any) => player.purchases)
  @JoinColumn({ name: 'user_id' })
  user: any;
}
