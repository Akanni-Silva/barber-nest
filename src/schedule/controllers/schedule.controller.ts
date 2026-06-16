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
} from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateWorkScheduleDto } from '../dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from '../dto/update-work-schedule.dto';
import { CreateBlockedDateDto } from '../dto/create-blocked-date.dto';
import { CreateSpecialHoursDto } from '../dto/create-special-hours.dto';
import { CreateBreakTimeDto } from '../dto/create-break-time.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // ==================== WORK SCHEDULE ====================

  @Post('work-schedule')
  async upsertWorkSchedule(@Body() dto: CreateWorkScheduleDto) {
    return await this.scheduleService.upsertWorkSchedule(dto);
  }

  @Get('work-schedule')
  async findAllWorkSchedules() {
    return await this.scheduleService.findAllWorkSchedules();
  }

  @Get('work-schedule/:dayOfWeek')
  async findWorkScheduleByDay(
    @Param('dayOfWeek', ParseIntPipe) dayOfWeek: number,
  ) {
    return await this.scheduleService.findWorkScheduleByDay(dayOfWeek);
  }

  @Put('work-schedule/:id')
  async updateWorkSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkScheduleDto,
  ) {
    return await this.scheduleService.updateWorkSchedule(id, dto);
  }

  @Delete('work-schedule/:id')
  async deleteWorkSchedule(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteWorkSchedule(id);
    return { message: 'Horário removido com sucesso' };
  }

  // ==================== BLOCKED DATES ====================

  @Post('blocked-dates')
  async blockDate(@Body() dto: CreateBlockedDateDto) {
    return await this.scheduleService.blockDate(dto);
  }

  @Get('blocked-dates')
  async findAllBlockedDates(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.scheduleService.findAllBlockedDates(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Delete('blocked-dates/:id')
  async unblockDate(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.unblockDate(id);
    return { message: 'Data desbloqueada com sucesso' };
  }

  // ==================== SPECIAL HOURS ====================

  @Post('special-hours')
  async createSpecialHours(@Body() dto: CreateSpecialHoursDto) {
    return await this.scheduleService.createSpecialHours(dto);
  }

  @Get('special-hours')
  async findAllSpecialHours() {
    return await this.scheduleService.findAllSpecialHours();
  }

  @Put('special-hours/:id')
  async updateSpecialHours(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateSpecialHoursDto>,
  ) {
    return await this.scheduleService.updateSpecialHours(id, dto);
  }

  @Delete('special-hours/:id')
  async deleteSpecialHours(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteSpecialHours(id);
    return { message: 'Horário especial removido com sucesso' };
  }

  // ==================== BREAK TIMES ====================

  @Post('breaks')
  async createBreakTime(@Body() dto: CreateBreakTimeDto) {
    return await this.scheduleService.createBreakTime(dto);
  }

  @Get('breaks/:date')
  async findBreaksByDate(@Param('date') date: string) {
    return await this.scheduleService.findBreaksByDate(new Date(date));
  }

  @Delete('breaks/:id')
  async deleteBreakTime(@Param('id', ParseIntPipe) id: number) {
    await this.scheduleService.deleteBreakTime(id);
    return { message: 'Pausa removida com sucesso' };
  }

  // ==================== UTILITÁRIOS ====================

  @Get('working-hours')
  async getWorkingHours(@Query('date') date: string) {
    return await this.scheduleService.getWorkingHoursForDate(new Date(date));
  }

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

  @Post('setup-default')
  async setupDefaultSchedule() {
    await this.scheduleService.setupDefaultSchedule();
    return { message: 'Horários padrão configurados com sucesso' };
  }
}
