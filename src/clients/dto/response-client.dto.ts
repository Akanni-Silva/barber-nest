/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/clients/dto/response-client.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../entities/client.entity';

export class ResponseClientDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  total_appointments: number;

  @ApiProperty()
  total_spent: number;

  @ApiProperty()
  last_visit: Date;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  preferences?: any;

  @ApiProperty()
  created_at: Date;

  constructor(client: Client) {
    this.id = client.id;
    this.name = client.name;
    this.phone = client.phone;
    this.total_appointments = client.total_appointments;
    this.total_spent = client.total_spent;
    this.last_visit = client.last_visit;
    this.is_active = client.is_active;
    this.notes = client.notes;
    this.preferences = client.preferences
      ? JSON.parse(client.preferences)
      : null;
    this.created_at = client.created_at;
  }
}
