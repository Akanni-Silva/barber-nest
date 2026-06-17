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
} from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateWorkScheduleDto } from '../dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from '../dto/update-work-schedule.dto';
import { CreateBlockedDateDto } from '../dto/create-blocked-date.dto';
import { CreateSpecialHoursDto } from '../dto/create-special-hours.dto';
import { CreateBreakTimeDto } from '../dto/create-break-time.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // ✅ PÚBLICO - Cliente pode ver horários disponíveis
  @Get('available-slots')
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('duration') duration?: string,
  ) {
    return await this.scheduleService.generateAvailableSlots(
      new Date(date),
      duration ? parseInt(duration) : 30,
    );
  }

  // ✅ PÚBLICO - Cliente pode ver horário de funcionamento
  @Get('working-hours')
  async getWorkingHours(@Query('date') date: string) {
    return await this.scheduleService.getWorkingHoursForDate(new Date(date));
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post('work-schedule')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async upsertWorkSchedule(@Body() dto: CreateWorkScheduleDto) {
    return await this.scheduleService.upsertWorkSchedule(dto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('work-schedule')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findAllWorkSchedules() {
    return await this.scheduleService.findAllWorkSchedules();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('work-schedule/:dayOfWeek')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findWorkScheduleByDay(
    @Param('dayOfWeek', ParseIntPipe) dayOfWeek: number,
  ) {
    return await this.scheduleService.findWorkScheduleByDay(dayOfWeek);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put('work-schedule/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async updateWorkSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkScheduleDto,
  ) {
    return await this.scheduleService.updateWorkSchedule(id, dto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete('work-schedule/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async deleteWorkSchedule(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteWorkSchedule(id);
    return { message: 'Horário removido com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post('blocked-dates')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async blockDate(@Body() dto: CreateBlockedDateDto) {
    return await this.scheduleService.blockDate(dto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('blocked-dates')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findAllBlockedDates(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.scheduleService.findAllBlockedDates(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete('blocked-dates/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async unblockDate(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.unblockDate(id);
    return { message: 'Data desbloqueada com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post('special-hours')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async createSpecialHours(@Body() dto: CreateSpecialHoursDto) {
    return await this.scheduleService.createSpecialHours(dto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('special-hours')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findAllSpecialHours() {
    return await this.scheduleService.findAllSpecialHours();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put('special-hours/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async updateSpecialHours(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateSpecialHoursDto>,
  ) {
    return await this.scheduleService.updateSpecialHours(id, dto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete('special-hours/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async deleteSpecialHours(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteSpecialHours(id);
    return { message: 'Horário especial removido com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post('breaks')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async createBreakTime(@Body() dto: CreateBreakTimeDto) {
    return await this.scheduleService.createBreakTime(dto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('breaks/:date')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findBreaksByDate(@Param('date') date: string) {
    return await this.scheduleService.findBreaksByDate(new Date(date));
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete('breaks/:id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async deleteBreakTime(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteBreakTime(id);
    return { message: 'Pausa removida com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post('setup-default')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async setupDefaultSchedule() {
    await this.scheduleService.setupDefaultSchedule();
    return { message: 'Horários padrão configurados com sucesso' };
  }
}
