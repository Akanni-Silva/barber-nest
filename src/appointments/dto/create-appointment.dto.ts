// src/appointments/dto/create-appointment.dto.ts
import {
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateAppointmentDto {
  // Dados do cliente (será usado para buscar/criar no Client)
  @IsString()
  client_name: string;

  @IsPhoneNumber('BR')
  client_phone: string;

  // Dados do serviço
  @IsInt()
  service_id: number;

  // Dados do agendamento
  @IsDateString()
  appointment_date: Date;

  @IsString()
  appointment_time: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
