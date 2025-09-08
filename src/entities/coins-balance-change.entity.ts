import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

@Entity('coins_balance_changes')
export class CoinsBalanceChange {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  balance_before: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  balance_after: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  amount: number;

  @Column({ type: 'varchar' })
  @IsString()
  mode: string; // game_win, purchase, bet, admin_adjustment, etc.

  @Column({ type: 'varchar' })
  @IsString()
  status: string; // completed, pending, failed

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne('Player', (player: any) => player.balanceChanges)
  @JoinColumn({ name: 'user_id' })
  user: any;
}
