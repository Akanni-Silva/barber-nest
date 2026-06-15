// src/schedule/dto/update-work-schedule.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkScheduleDto } from './create-work-schedule.dto';

export class UpdateWorkScheduleDto extends PartialType(CreateWorkScheduleDto) {}
