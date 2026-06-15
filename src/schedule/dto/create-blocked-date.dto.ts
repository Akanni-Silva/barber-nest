// src/schedule/dto/create-blocked-date.dto.ts
import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBlockedDateDto {
  @IsDateString()
  blocked_date: Date;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  is_full_day?: boolean;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;
}
