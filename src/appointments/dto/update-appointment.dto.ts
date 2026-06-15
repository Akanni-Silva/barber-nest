// src/appointments/dto/update-appointment.dto.ts
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointment_date?: Date;

  @IsOptional()
  @IsString()
  appointment_time?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
