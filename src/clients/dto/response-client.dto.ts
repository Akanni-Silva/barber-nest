/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/clients/dto/response-client.dto.ts
import { Client } from '../entities/client.entity';

export class ResponseClientDto {
  id: number;
  name: string;
  phone: string;
  total_appointments: number;
  total_spent: number;
  last_visit: Date;
  is_active: boolean;
  notes?: string;
  preferences?: any;
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
