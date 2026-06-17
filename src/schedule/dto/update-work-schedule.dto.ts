// src/schedule/dto/update-work-schedule.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateWorkScheduleDto } from './create-work-schedule.dto';

export class UpdateWorkScheduleDto extends PartialType(CreateWorkScheduleDto) {}
