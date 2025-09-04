import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsString, IsBoolean } from 'class-validator';
import { Casino } from './casino.entity';
import { Player } from './player.entity';

@Entity('casino_actions')
export class CasinoAction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  @IsString()
  casino_name: string;

  @Column({ type: 'timestamp with time zone' })
  date_of_action: Date;

  @Column({ type: 'varchar' })
  @IsString()
  visitor_id: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  registration: boolean;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  deposit: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Casino, (casino) => casino.actions, { nullable: true })
  @JoinColumn({ name: 'casino_name', referencedColumnName: 'casino_name' })
  casino?: Casino;

  @ManyToOne(() => Player, (player) => player.id, { nullable: true })
  @JoinColumn({ name: 'visitor_id', referencedColumnName: 'visitor_id' })
  player?: Player;
}
