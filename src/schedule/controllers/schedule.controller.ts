// src/schedule/controllers/schedule.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ScheduleService } from '../services/schedule.service';
import { CreateWorkScheduleDto } from '../dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from '../dto/update-work-schedule.dto';
import { CreateBlockedDateDto } from '../dto/create-blocked-date.dto';
import { CreateSpecialHoursDto } from '../dto/create-special-hours.dto';
import { CreateBreakTimeDto } from '../dto/create-break-time.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';

@ApiTags('Agenda')
@ApiBearerAuth()
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * ✅ PÚBLICO - Cliente pode ver horários disponíveis
   * GET /schedule/available-slots
   */
  @Get('available-slots')
  @ApiOperation({ summary: 'Buscar horários disponíveis (público)' })
  @ApiQuery({ name: 'date', description: 'Data no formato YYYY-MM-DD' })
  @ApiQuery({
    name: 'duration',
    required: false,
    description: 'Duração do serviço em minutos',
  })
  @ApiResponse({ status: 200, description: 'Lista de horários disponíveis' })
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('duration') duration?: string,
  ) {
    return await this.scheduleService.generateAvailableSlots(
      new Date(date),
      duration ? parseInt(duration) : 30,
    );
  }

  /**
   * ✅ PÚBLICO - Cliente pode ver horário de funcionamento
   * GET /schedule/working-hours
   */
  @Get('working-hours')
  @ApiOperation({ summary: 'Buscar horário de funcionamento (público)' })
  @ApiQuery({ name: 'date', description: 'Data no formato YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Horário de funcionamento' })
  async getWorkingHours(@Query('date') date: string) {
    return await this.scheduleService.getWorkingHoursForDate(new Date(date));
  }

  /**
   * ❌ PROTEGIDO - Configurar horário de trabalho
   * POST /schedule/work-schedule
   */
  @Post('work-schedule')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Configurar horário de trabalho (barbeiro)' })
  @ApiResponse({ status: 201, description: 'Horário configurado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async upsertWorkSchedule(@Body() dto: CreateWorkScheduleDto) {
    return await this.scheduleService.upsertWorkSchedule(dto);
  }

  /**
   * ❌ PROTEGIDO - Listar horários configurados
   * GET /schedule/work-schedule
   */
  @Get('work-schedule')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar horários configurados (barbeiro)' })
  @ApiResponse({ status: 200, description: 'Lista de horários' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllWorkSchedules() {
    return await this.scheduleService.findAllWorkSchedules();
  }

  /**
   * ❌ PROTEGIDO - Buscar horário por dia da semana
   * GET /schedule/work-schedule/:dayOfWeek
   */
  @Get('work-schedule/:dayOfWeek')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar horário por dia da semana (barbeiro)' })
  @ApiParam({
    name: 'dayOfWeek',
    description: '0=Domingo, 1=Segunda, ..., 6=Sábado',
  })
  @ApiResponse({ status: 200, description: 'Horário encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Horário não encontrado' })
  async findWorkScheduleByDay(
    @Param('dayOfWeek', ParseIntPipe) dayOfWeek: number,
  ) {
    return await this.scheduleService.findWorkScheduleByDay(dayOfWeek);
  }

  /**
   * ❌ PROTEGIDO - Atualizar horário
   * PUT /schedule/work-schedule/:id
   */
  @Put('work-schedule/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Atualizar horário de trabalho (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do horário' })
  @ApiResponse({ status: 200, description: 'Horário atualizado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Horário não encontrado' })
  async updateWorkSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkScheduleDto,
  ) {
    return await this.scheduleService.updateWorkSchedule(id, dto);
  }

  /**
   * ❌ PROTEGIDO - Deletar horário
   * DELETE /schedule/work-schedule/:id
   */
  @Delete('work-schedule/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar horário de trabalho (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do horário' })
  @ApiResponse({ status: 200, description: 'Horário removido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Horário não encontrado' })
  async deleteWorkSchedule(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteWorkSchedule(id);
    return { message: 'Horário removido com sucesso' };
  }

  /**
   * ❌ PROTEGIDO - Bloquear data
   * POST /schedule/blocked-dates
   */
  @Post('blocked-dates')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Bloquear uma data (barbeiro)' })
  @ApiResponse({ status: 201, description: 'Data bloqueada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Data já está bloqueada' })
  async blockDate(@Body() dto: CreateBlockedDateDto) {
    return await this.scheduleService.blockDate(dto);
  }

  /**
   * ❌ PROTEGIDO - Listar datas bloqueadas
   * GET /schedule/blocked-dates
   */
  @Get('blocked-dates')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar datas bloqueadas (barbeiro)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final' })
  @ApiResponse({ status: 200, description: 'Lista de datas bloqueadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllBlockedDates(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.scheduleService.findAllBlockedDates(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * ❌ PROTEGIDO - Desbloquear data
   * DELETE /schedule/blocked-dates/:id
   */
  @Delete('blocked-dates/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desbloquear uma data (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do bloqueio' })
  @ApiResponse({ status: 200, description: 'Data desbloqueada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Bloqueio não encontrado' })
  async unblockDate(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.unblockDate(id);
    return { message: 'Data desbloqueada com sucesso' };
  }

  /**
   * ❌ PROTEGIDO - Criar horário especial
   * POST /schedule/special-hours
   */
  @Post('special-hours')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Criar horário especial (barbeiro)' })
  @ApiResponse({ status: 201, description: 'Horário especial criado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Horário especial já existe' })
  async createSpecialHours(@Body() dto: CreateSpecialHoursDto) {
    return await this.scheduleService.createSpecialHours(dto);
  }

  /**
   * ❌ PROTEGIDO - Listar horários especiais
   * GET /schedule/special-hours
   */
  @Get('special-hours')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar horários especiais (barbeiro)' })
  @ApiResponse({ status: 200, description: 'Lista de horários especiais' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllSpecialHours() {
    return await this.scheduleService.findAllSpecialHours();
  }

  /**
   * ❌ PROTEGIDO - Atualizar horário especial
   * PUT /schedule/special-hours/:id
   */
  @Put('special-hours/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Atualizar horário especial (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do horário especial' })
  @ApiResponse({ status: 200, description: 'Horário especial atualizado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Horário especial não encontrado' })
  async updateSpecialHours(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateSpecialHoursDto>,
  ) {
    return await this.scheduleService.updateSpecialHours(id, dto);
  }

  /**
   * ❌ PROTEGIDO - Deletar horário especial
   * DELETE /schedule/special-hours/:id
   */
  @Delete('special-hours/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar horário especial (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do horário especial' })
  @ApiResponse({ status: 200, description: 'Horário especial removido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Horário especial não encontrado' })
  async deleteSpecialHours(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteSpecialHours(id);
    return { message: 'Horário especial removido com sucesso' };
  }

  /**
   * ❌ PROTEGIDO - Criar pausa
   * POST /schedule/breaks
   */
  @Post('breaks')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Criar uma pausa (barbeiro)' })
  @ApiResponse({ status: 201, description: 'Pausa criada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async createBreakTime(@Body() dto: CreateBreakTimeDto) {
    return await this.scheduleService.createBreakTime(dto);
  }

  /**
   * ❌ PROTEGIDO - Buscar pausas por data
   * GET /schedule/breaks/:date
   */
  @Get('breaks/:date')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar pausas por data (barbeiro)' })
  @ApiParam({ name: 'date', description: 'Data no formato YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Lista de pausas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBreaksByDate(@Param('date') date: string) {
    return await this.scheduleService.findBreaksByDate(new Date(date));
  }

  /**
   * ❌ PROTEGIDO - Deletar pausa
   * DELETE /schedule/breaks/:id
   */
  @Delete('breaks/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar pausa (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID da pausa' })
  @ApiResponse({ status: 200, description: 'Pausa removida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Pausa não encontrada' })
  async deleteBreakTime(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteBreakTime(id);
    return { message: 'Pausa removida com sucesso' };
  }

  /**
   * ❌ PROTEGIDO - Configurar horários padrão
   * POST /schedule/setup-default
   */
  @Post('setup-default')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Configurar horários padrão (barbeiro)' })
  @ApiResponse({ status: 201, description: 'Horários padrão configurados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async setupDefaultSchedule() {
    await this.scheduleService.setupDefaultSchedule();
    return { message: 'Horários padrão configurados com sucesso' };
  }
}
