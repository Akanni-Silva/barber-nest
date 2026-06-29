// src/auth/entities/barber.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('barbers')
export class Barber {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ unique: true, length: 100 })
  email: string;

  @ApiProperty()
  @Column({ length: 255 })
  password_hash: string;

  @ApiProperty()
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  // ✅ Campos de endereço
  @ApiProperty({ required: false })
  @Column({ length: 200, nullable: true })
  address: string;

  @ApiProperty({ required: false })
  @Column({ length: 20, nullable: true })
  address_number: string;

  @ApiProperty({ required: false })
  @Column({ length: 100, nullable: true })
  neighborhood: string;

  @ApiProperty({ required: false })
  @Column({ length: 100, nullable: true })
  city: string;

  @ApiProperty({ required: false })
  @Column({ length: 2, nullable: true })
  state: string;

  @ApiProperty({ required: false })
  @Column({ length: 10, nullable: true })
  zip_code: string;

  // ✅ Horário de funcionamento
  @ApiProperty({ required: false })
  @Column({ length: 100, nullable: true })
  working_hours: string;

  // ✅ Redes sociais e contato
  @ApiProperty({ required: false })
  @Column({ length: 20, nullable: true })
  whatsapp: string;

  @ApiProperty({ required: false })
  @Column({ length: 50, nullable: true })
  instagram: string;

  @ApiProperty({ required: false })
  @Column({ length: 100, nullable: true })
  facebook: string;

  // ✅ Link do Google Maps
  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  google_maps_url: string;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  last_login_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  // ✅ Campos para recuperação de senha
  @ApiProperty({ required: false })
  @Column({ length: 255, nullable: true })
  reset_password_token: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  reset_password_expires: Date | null;
}
