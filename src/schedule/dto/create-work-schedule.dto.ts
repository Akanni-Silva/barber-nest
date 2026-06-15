// src/schedule/dto/create-work-schedule.dto.ts
import {
  IsInt,
  IsBoolean,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateWorkScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @IsBoolean()
  is_working: boolean;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsInt()
  slot_duration?: number;

  @IsOptional()
  @IsString()
  lunch_start?: string;

  @IsOptional()
  @IsString()
  lunch_end?: string;
}
