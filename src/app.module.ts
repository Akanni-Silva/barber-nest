import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointments/entities/appointment.entity';
import { Client } from './clients/entities/client.entity';
import { Product } from './products/entities/product.entity';
import { WorkSchedule } from './schedule/entities/work-schedule.entity';
import { BlockedDate } from './schedule/entities/blocked-date.entity';
import { SpecialHours } from './schedule/entities/special-hours.entity';
import { BreakTime } from './schedule/entities/break-time.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
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
        SpecialHours,
        BreakTime,
      ],
      synchronize: true,
    }),
    AppointmentsModule,
    ClientsModule,
    ProductsModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
