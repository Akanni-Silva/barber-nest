// src/schedule/dto/create-work-schedule.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsBoolean,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateWorkScheduleDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @ApiProperty()
  @IsBoolean()
  is_working: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  slot_duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lunch_start?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lunch_end?: string;
}
