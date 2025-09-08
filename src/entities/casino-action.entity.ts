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
  @ManyToOne('Casino', (casino: any) => casino.actions, { nullable: true })
  @JoinColumn({ name: 'casino_name', referencedColumnName: 'casino_name' })
  casino?: any;

  @ManyToOne('Player', (player: any) => player.casinoActions, {
    nullable: true,
  })
  @JoinColumn({ name: 'visitor_id', referencedColumnName: 'visitor_id' })
  player?: any;
}
