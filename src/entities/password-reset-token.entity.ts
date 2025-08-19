import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'bigint' })
  user_id: number;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'user_id' })
  user: Player;

  @Column({ type: 'timestamp with time zone' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
