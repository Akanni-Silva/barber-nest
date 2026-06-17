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
  @Column({ nullable: true, length: 255 })
  avatar_url: string;

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
}
