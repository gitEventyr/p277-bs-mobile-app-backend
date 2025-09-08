import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsString, IsOptional } from 'class-validator';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar' })
  @IsString()
  udid: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  os_type?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  os_version?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  browser?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  ip?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  isp?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  device_fb_id?: string;

  @Column({ type: 'timestamp with time zone' })
  logged_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relationships
  @ManyToOne('Player', (player: any) => player.devices)
  @JoinColumn({ name: 'user_id' })
  user: any;
}
