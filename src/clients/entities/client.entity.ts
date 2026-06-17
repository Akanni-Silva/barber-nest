import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('clients')
export class Client {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ length: 20, unique: true })
  phone: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true, length: 255 })
  avatar_url: string;

  @ApiProperty()
  @Column({ default: 0 })
  total_appointments: number;

  @ApiProperty()
  @Column({ default: 0 })
  total_spent: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true, type: 'date' })
  last_visit: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true, length: 500 })
  notes: string;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true, type: 'text' })
  preferences: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => [Appointment] })
  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];
}
