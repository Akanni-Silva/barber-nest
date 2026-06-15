// src/schedule/dto/create-break-time.dto.ts
import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBreakTimeDto {
  @IsDateString()
  break_date: Date;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;
}
