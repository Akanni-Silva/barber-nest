// src/schedule/entities/break-time.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('break_times')
export class BreakTime {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'date' })
  break_date: Date;

  @ApiProperty()
  @Column({ type: 'time' })
  start_time: string;

  @ApiProperty()
  @Column({ type: 'time' })
  end_time: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true, length: 255 })
  reason: string;

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
