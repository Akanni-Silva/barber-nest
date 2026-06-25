// backend/src/products/entities/product.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum ProductCategory {
  HAIRCUT = 'corte',
  BEARD = 'barba',
  COLORING = 'coloracao',
  TREATMENT = 'tratamento',
  STYLING = 'estilizacao',
  PACKAGE = 'pacote',
  OTHER = 'outros',
}

@Entity('products')
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @ApiProperty()
  @Column()
  duration_minutes: number;

  @ApiProperty({ enum: ProductCategory })
  @Column({
    type: 'enum',
    enum: ProductCategory,
    default: ProductCategory.OTHER,
  })
  category: ProductCategory;

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
