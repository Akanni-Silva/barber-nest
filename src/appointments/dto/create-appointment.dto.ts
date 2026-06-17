// src/appointments/dto/create-appointment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  client_name: string;

  @ApiProperty()
  @IsPhoneNumber('BR')
  client_phone: string;

  @ApiProperty()
  @IsInt()
  service_id: number;

  @ApiProperty()
  @IsDateString()
  appointment_date: Date;

  @ApiProperty()
  @IsString()
  appointment_time: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
