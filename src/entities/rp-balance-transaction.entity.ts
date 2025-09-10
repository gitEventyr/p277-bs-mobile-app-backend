import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity('rp_balance_transactions')
export class RpBalanceTransaction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'double precision' })
  balance_before: number;

  @Column({ type: 'double precision' })
  balance_after: number;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  mode: string; // 'increase', 'decrease', 'admin_set', 'admin_increase', 'admin_decrease', etc.

  @Column({ type: 'text', nullable: true })
  reason?: string; // Optional reason for the transaction

  @Column({ type: 'varchar', length: 50, nullable: true })
  admin_id?: string; // Admin ID if changed by admin

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  // Relationship
  @ManyToOne(() => Player, (player) => player.rpBalanceTransactions)
  @JoinColumn({ name: 'user_id' })
  user: Player;
}