// src/appointments/entities/appointment.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('appointments')
@Unique(['appointment_date', 'appointment_time'])
export class Appointment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Client })
  @ManyToOne(() => Client, (client) => client.appointments, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ApiProperty()
  @Column()
  client_id: number;

  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product, (product) => product.appointments, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Product;

  @ApiProperty()
  @Column()
  service_id: number;

  @ApiProperty()
  @Column({ type: 'date' })
  appointment_date: Date;

  @ApiProperty()
  @Column({ type: 'time' })
  appointment_time: string;

  @ApiProperty({ enum: ['pending', 'confirmed', 'completed', 'cancelled'] })
  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true, type: 'text' })
  notes: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  whatsapp_message_id: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
