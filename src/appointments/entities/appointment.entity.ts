import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.appointments, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ length: 100 })
  client_name: string;

  @Column({ length: 20 })
  client_phone: string;

  @ManyToOne(() => Product, (product) => product.appointments, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Product;

  @Column()
  service_id: number;

  @Column({ type: 'date' })
  appointment_date: Date;

  @Column({ type: 'time' })
  appointment_time: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true })
  whatsapp_message_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
