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
} from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Criar um novo agendamento
   * POST /appointments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateAppointmentDto) {
    return await this.appointmentsService.create(createDto);
  }

  /**
   * Listar todos os agendamentos (com filtros)
   * GET /appointments?status=confirmed&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=20
   */
  @Get()
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

  /**
   * Listar agendamentos do dia
   * GET /appointments/today
   */
  @Get('today')
  async findToday() {
    return await this.appointmentsService.findToday();
  }

  /**
   * Listar agendamentos futuros
   * GET /appointments/upcoming?limit=10
   */
  @Get('upcoming')
  async findUpcoming(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.appointmentsService.findUpcoming(limit);
  }

  /**
   * Buscar agendamento por ID
   * GET /appointments/1
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.findById(id);
  }

  /**
   * Buscar agendamentos por cliente
   * GET /appointments/client/1
   */
  @Get('client/:clientId')
  async findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return await this.appointmentsService.findByClient(clientId);
  }

  /**
   * Estatísticas de agendamentos
   * GET /appointments/stats
   */
  @Get('stats')
  async getStats() {
    return await this.appointmentsService.getStats();
  }

  /**
   * Confirmar agendamento (via WhatsApp)
   * PATCH /appointments/1/confirm
   */
  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.confirm(id);
  }

  /**
   * Completar agendamento (atendimento finalizado)
   * PATCH /appointments/1/complete
   */
  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  async complete(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.complete(id);
  }

  /**
   * Cancelar agendamento
   * PATCH /appointments/1/cancel
   * Body: { "reason": "Cliente não compareceu" }
   */
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason?: string,
  ) {
    return await this.appointmentsService.cancel(id, reason);
  }

  /**
   * Reagendar agendamento
   * PUT /appointments/1/reschedule
   */
  @Put(':id/reschedule')
  @HttpCode(HttpStatus.OK)
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body('appointment_date') newDate: Date,
    @Body('appointment_time') newTime: string,
  ) {
    return await this.appointmentsService.reschedule(id, newDate, newTime);
  }

  /**
   * Atualizar dados do agendamento (apenas notes e status)
   * PUT /appointments/1
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    // Nota: Este método precisa ser implementado no service se necessário
    // Para agora, vamos apenas retornar que não está implementado
    // Ou podemos usar o método existente
    return await this.appointmentsService.update(id, updateDto);
  }

  /**
   * Deletar agendamento (apenas se pendente ou cancelado)
   * DELETE /appointments/1
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentsService.delete(id);
    return {
      message: 'Agendamento removido com sucesso',
      statusCode: HttpStatus.OK,
    };
  }
}
