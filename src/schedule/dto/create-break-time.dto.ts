// src/schedule/dto/create-break-time.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBreakTimeDto {
  @ApiProperty()
  @IsDateString()
  break_date: Date;

  @ApiProperty()
  @IsString()
  start_time: string;

  @ApiProperty()
  @IsString()
  end_time: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;
}
