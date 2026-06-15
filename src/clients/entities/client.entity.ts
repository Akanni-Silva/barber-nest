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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ nullable: true, length: 255 })
  avatar_url: string;

  @Column({ default: 0 })
  total_appointments: number;

  @Column({ default: 0 })
  total_spent: number;

  @Column({ nullable: true, type: 'date' })
  last_visit: Date;

  @Column({ nullable: true, length: 500 })
  notes: string; // observações do barbeiro sobre o cliente

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true, type: 'text' })
  preferences: string; // JSON com preferências (ex: "corte na tesoura", "barba com navalha")

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamento: um cliente pode ter muitos agendamentos
  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];
}
