// src/appointments/dto/update-appointment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  appointment_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  appointment_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
