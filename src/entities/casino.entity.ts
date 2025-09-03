import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString } from 'class-validator';
import { CasinoAction } from './casino-action.entity';

@Entity('casinos')
export class Casino {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  casino_name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @OneToMany(() => CasinoAction, (action) => action.casino)
  actions: CasinoAction[];
}
