import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Appointment } from '../../../appointments/entities/appointment.entity';
import { Client } from '../../../clients/entities/client.entity';
import { Product } from '../../../products/entities/product.entity';
import { WorkSchedule } from '../../../schedule/entities/work-schedule.entity';
import { BlockedDate } from '../../../schedule/entities/blocked-date.entity';
import { BreakTime } from '../../../schedule/entities/break-time.entity';
import { SpecialHours } from '../../../schedule/entities/special-hours.entity';

@Injectable()
export class DevService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_barber',
      entities: [
        Appointment,
        Client,
        Product,
        WorkSchedule,
        BlockedDate,
        BreakTime,
        SpecialHours,
      ],
      synchronize: true,
    };
  }
}
