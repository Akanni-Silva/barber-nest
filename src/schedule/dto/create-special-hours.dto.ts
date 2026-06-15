// src/schedule/dto/create-special-hours.dto.ts
import {
  IsDateString,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateSpecialHoursDto {
  @IsDateString()
  special_date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsOptional()
  @IsInt()
  slot_duration?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
