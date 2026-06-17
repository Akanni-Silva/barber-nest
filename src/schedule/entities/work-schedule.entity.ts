// src/schedule/entities/work-schedule.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('work_schedule')
export class WorkSchedule {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'int' })
  day_of_week: number;

  @ApiProperty()
  @Column({ default: true })
  is_working: boolean;

  @ApiProperty({ required: false })
  @Column({ type: 'time', nullable: true })
  start_time: string;

  @ApiProperty({ required: false })
  @Column({ type: 'time', nullable: true })
  end_time: string;

  @ApiProperty()
  @Column({ default: 30 })
  slot_duration: number;

  @ApiProperty({ required: false })
  @Column({ type: 'time', nullable: true })
  lunch_start: string;

  @ApiProperty({ required: false })
  @Column({ type: 'time', nullable: true })
  lunch_end: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
