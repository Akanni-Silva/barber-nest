// src/schedule/dto/create-special-hours.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateSpecialHoursDto {
  @ApiProperty()
  @IsDateString()
  special_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  start_time: string;

  @ApiProperty()
  @IsString()
  end_time: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  slot_duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
