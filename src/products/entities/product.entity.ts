import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('products')
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @ApiProperty()
  @Column()
  duration_minutes: number;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: () => [Appointment] })
  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
