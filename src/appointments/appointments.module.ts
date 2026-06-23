import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';

import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';
import { AppointmentsController } from './controllers/appointment.controller';
import { AppointmentsService } from './services/appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    ClientsModule,
    ProductsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
