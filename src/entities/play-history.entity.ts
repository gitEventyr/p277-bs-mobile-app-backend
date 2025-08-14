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
import { Player } from './player.entity';

@Entity('play_history')
export class PlayHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  bet: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  won: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Min(0)
  lost: number;

  @Column({ type: 'varchar' })
  @IsString()
  game_name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Player, player => player.playHistory)
  @JoinColumn({ name: 'user_id' })
  user: Player;
}