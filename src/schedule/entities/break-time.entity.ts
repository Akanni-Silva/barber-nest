// src/schedule/entities/break-time.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('break_times')
export class BreakTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  break_date: Date; // ✅ Date é aceito para colunas DATE

  @Column({ type: 'time' })
  start_time: string; // ✅ string, NÃO Date!

  @Column({ type: 'time' })
  end_time: string; // ✅ string, NÃO Date!

  @Column({ nullable: true, length: 255 })
  reason: string;

  @Column({ default: false })
  is_recurring: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
