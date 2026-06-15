// src/schedule/entities/blocked-date.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blocked_dates')
export class BlockedDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  blocked_date: Date; // ✅ Date é aceito para colunas DATE

  @Column({ nullable: true, length: 255 })
  reason: string;

  @Column({ default: true })
  is_full_day: boolean;

  @Column({ type: 'time', nullable: true })
  start_time: string; // ✅ string, NÃO Date!

  @Column({ type: 'time', nullable: true })
  end_time: string; // ✅ string, NÃO Date!

  @Column({ default: false })
  is_recurring: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
