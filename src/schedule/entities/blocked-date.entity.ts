// src/schedule/entities/blocked-date.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blocked_dates')
export class BlockedDate {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'date' })
  blocked_date: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true, length: 255 })
  reason: string;

  @ApiProperty()
  @Column({ default: true })
  is_full_day: boolean;

  @ApiProperty({ required: false })
  @Column({ type: 'time', nullable: true })
  start_time: string;

  @ApiProperty({ required: false })
  @Column({ type: 'time', nullable: true })
  end_time: string;

  @ApiProperty()
  @Column({ default: false })
  is_recurring: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
