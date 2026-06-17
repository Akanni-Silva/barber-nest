// src/schedule/dto/create-blocked-date.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBlockedDateDto {
  @ApiProperty()
  @IsDateString()
  blocked_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_full_day?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  end_time?: string;
}
