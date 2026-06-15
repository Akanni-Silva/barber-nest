// src/schedule/entities/special-hours.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('special_hours')
export class SpecialHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  special_date: Date; // ✅ Date é aceito para colunas DATE

  @Column({ nullable: true, length: 255 })
  description: string;

  @Column({ type: 'time' })
  start_time: string; // ✅ string, NÃO Date!

  @Column({ type: 'time' })
  end_time: string; // ✅ string, NÃO Date!

  @Column({ default: 30 })
  slot_duration: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
