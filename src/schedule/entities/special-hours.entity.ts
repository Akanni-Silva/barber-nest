// src/schedule/entities/special-hours.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('special_hours')
export class SpecialHours {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'date' })
  special_date: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true, length: 255 })
  description: string;

  @ApiProperty()
  @Column({ type: 'time' })
  start_time: string;

  @ApiProperty()
  @Column({ type: 'time' })
  end_time: string;

  @ApiProperty()
  @Column({ default: 30 })
  slot_duration: number;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
