import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './services/schedule.service';
import { ScheduleController } from './controllers/schedule.controller';
import { WorkSchedule } from './entities/work-schedule.entity';
import { BlockedDate } from './entities/blocked-date.entity';
import { SpecialHours } from './entities/special-hours.entity';
import { BreakTime } from './entities/break-time.entity';
import { AppointmentsModule } from '../appointments/appointments.module';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkSchedule,
      BlockedDate,
      SpecialHours,
      BreakTime,
      Appointment,
    ]),
    AppointmentsModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
