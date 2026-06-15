// src/schedule/entities/work-schedule.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('work_schedule')
export class WorkSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  day_of_week: number;

  @Column({ default: true })
  is_working: boolean;

  @Column({ type: 'time', nullable: true })
  start_time: string; // ✅ string, NÃO Date!

  @Column({ type: 'time', nullable: true })
  end_time: string; // ✅ string, NÃO Date!

  @Column({ default: 30 })
  slot_duration: number;

  @Column({ type: 'time', nullable: true })
  lunch_start: string; // ✅ string, NÃO Date!

  @Column({ type: 'time', nullable: true })
  lunch_end: string; // ✅ string, NÃO Date!

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
