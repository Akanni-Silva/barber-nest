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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';

@ApiTags('Agendamentos')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * ✅ PÚBLICO - Criar um novo agendamento
   * POST /appointments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Horário não disponível' })
  async create(@Body() createDto: CreateAppointmentDto) {
    return await this.appointmentsService.create(createDto);
  }

  /**
   * ❌ PROTEGIDO - Listar todos os agendamentos (com filtros)
   * GET /appointments
   */
  @Get()
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar todos os agendamentos (barbeiro)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
   * ❌ PROTEGIDO - Agendamentos de hoje
   * GET /appointments/today
   */
  @Get('today')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar agendamentos de hoje (barbeiro)' })
  @ApiResponse({ status: 200, description: 'Agendamentos de hoje' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findToday() {
    return await this.appointmentsService.findToday();
  }

  /**
   * ❌ PROTEGIDO - Próximos agendamentos
   * GET /appointments/upcoming
   */
  @Get('upcoming')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar próximos agendamentos (barbeiro)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados',
  })
  @ApiResponse({ status: 200, description: 'Próximos agendamentos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findUpcoming(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.appointmentsService.findUpcoming(limit);
  }

  /**
   * ❌ PROTEGIDO - Estatísticas de agendamentos
   * GET /appointments/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Estatísticas de agendamentos (barbeiro)' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getStats() {
    return await this.appointmentsService.getStats();
  }

  /**
   * ✅ PÚBLICO - Buscar agendamento por ID
   * GET /appointments/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID (público)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento encontrado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.findById(id);
  }

  /**
   * ❌ PROTEGIDO - Agendamentos por cliente
   * GET /appointments/client/:clientId
   */
  @Get('client/:clientId')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar agendamentos por cliente (barbeiro)' })
  @ApiParam({ name: 'clientId', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Agendamentos do cliente' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return await this.appointmentsService.findByClient(clientId);
  }

  /**
   * ❌ PROTEGIDO - Confirmar agendamento
   * PATCH /appointments/:id/confirm
   */
  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar agendamento (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento confirmado' })
  @ApiResponse({ status: 400, description: 'Não é possível confirmar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  async confirm(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.confirm(id);
  }

  /**
   * ❌ PROTEGIDO - Completar agendamento
   * PATCH /appointments/:id/complete
   */
  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Completar agendamento (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento finalizado' })
  @ApiResponse({ status: 400, description: 'Não é possível finalizar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  async complete(@Param('id', ParseIntPipe) id: number) {
    return await this.appointmentsService.complete(id);
  }

  /**
   * ❌ PROTEGIDO - Cancelar agendamento
   * PATCH /appointments/:id/cancel
   */
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar agendamento (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiQuery({
    name: 'reason',
    required: false,
    description: 'Motivo do cancelamento',
  })
  @ApiResponse({ status: 200, description: 'Agendamento cancelado' })
  @ApiResponse({ status: 400, description: 'Não é possível cancelar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason?: string,
  ) {
    return await this.appointmentsService.cancel(id, reason);
  }

  /**
   * ❌ PROTEGIDO - Reagendar agendamento
   * PUT /appointments/:id/reschedule
   */
  @Put(':id/reschedule')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reagendar agendamento (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento reagendado' })
  @ApiResponse({ status: 400, description: 'Não é possível reagendar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  @ApiResponse({ status: 409, description: 'Horário não disponível' })
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body('appointment_date') newDate: Date,
    @Body('appointment_time') newTime: string,
  ) {
    return await this.appointmentsService.reschedule(id, newDate, newTime);
  }

  /**
   * ❌ PROTEGIDO - Atualizar agendamento
   * PUT /appointments/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Atualizar agendamento (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento atualizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  @ApiResponse({ status: 409, description: 'Horário não disponível' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentsService.update(id, updateDto);
  }

  /**
   * ❌ PROTEGIDO - Deletar agendamento
   * DELETE /appointments/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar agendamento (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento removido' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentsService.delete(id);
    return { message: 'Agendamento removido com sucesso' };
  }
}
