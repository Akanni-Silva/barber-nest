/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/appointments/controllers/appointments.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Agendamentos')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // ✅ PÚBLICO - Cliente pode criar agendamento
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateAppointmentDto) {
    return await this.appointmentsService.create(createDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get()
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findAll(
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.appointmentsService.findAll({
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit,
    });
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('today')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findToday() {
    return await this.appointmentsService.findToday();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('upcoming')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findUpcoming(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.appointmentsService.findUpcoming(limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('stats')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getStats() {
    return await this.appointmentsService.getStats();
  }

  // ✅ PÚBLICO - Cliente pode ver status do agendamento
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.findById(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('client/:clientId')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return await this.appointmentsService.findByClient(clientId);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.confirm(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async complete(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.complete(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason?: string,
  ) {
    return await this.appointmentsService.cancel(id, reason);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/reschedule')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body('appointment_date') newDate: Date,
    @Body('appointment_time') newTime: string,
  ) {
    return await this.appointmentsService.reschedule(id, newDate, newTime);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentsService.update(id, updateDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentsService.delete(id);
    return { message: 'Agendamento removido com sucesso' };
  }
}
