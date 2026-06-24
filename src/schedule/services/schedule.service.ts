/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/schedule/services/schedule.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { WorkSchedule } from '../../schedule/entities/work-schedule.entity';
import { BlockedDate } from '../../schedule/entities/blocked-date.entity';
import { SpecialHours } from '../../schedule/entities/special-hours.entity';
import { BreakTime } from '../../schedule/entities/break-time.entity';

import { CreateWorkScheduleDto } from '../../schedule/dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from '../../schedule/dto/update-work-schedule.dto';
import { CreateBlockedDateDto } from '../../schedule/dto/create-blocked-date.dto';
import { CreateSpecialHoursDto } from '../../schedule/dto/create-special-hours.dto';
import { CreateBreakTimeDto } from '../../schedule/dto/create-break-time.dto';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(WorkSchedule)
    private workScheduleRepository: Repository<WorkSchedule>,
    @InjectRepository(BlockedDate)
    private blockedDateRepository: Repository<BlockedDate>,
    @InjectRepository(SpecialHours)
    private specialHoursRepository: Repository<SpecialHours>,
    @InjectRepository(BreakTime)
    private breakTimeRepository: Repository<BreakTime>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // ==================== WORK SCHEDULE ====================

  async upsertWorkSchedule(
    createDto: CreateWorkScheduleDto,
  ): Promise<WorkSchedule> {
    const existing = await this.workScheduleRepository.findOne({
      where: { day_of_week: createDto.day_of_week },
    });

    if (existing) {
      Object.assign(existing, createDto);
      return await this.workScheduleRepository.save(existing);
    }

    const schedule = this.workScheduleRepository.create(createDto);
    return await this.workScheduleRepository.save(schedule);
  }

  async findWorkScheduleByDay(dayOfWeek: number): Promise<WorkSchedule> {
    const schedule = await this.workScheduleRepository.findOne({
      where: { day_of_week: dayOfWeek },
    });

    if (!schedule) {
      throw new NotFoundException(
        `Horário para o dia ${dayOfWeek} não encontrado`,
      );
    }

    return schedule;
  }

  async findAllWorkSchedules(): Promise<WorkSchedule[]> {
    return await this.workScheduleRepository.find({
      order: { day_of_week: 'ASC' },
    });
  }

  async updateWorkSchedule(
    id: number,
    updateDto: UpdateWorkScheduleDto,
  ): Promise<WorkSchedule> {
    const schedule = await this.workScheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(
        `Horário de trabalho com ID ${id} não encontrado`,
      );
    }

    Object.assign(schedule, updateDto);
    return await this.workScheduleRepository.save(schedule);
  }

  async deleteWorkSchedule(id: number): Promise<void> {
    const schedule = await this.workScheduleRepository.findOne({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(
        `Horário de trabalho com ID ${id} não encontrado`,
      );
    }

    await this.workScheduleRepository.remove(schedule);
  }

  // ==================== BLOCKED DATES ====================

  async blockDate(createDto: CreateBlockedDateDto): Promise<BlockedDate> {
    const existing = await this.blockedDateRepository.findOne({
      where: { blocked_date: createDto.blocked_date },
    });

    if (existing) {
      throw new ConflictException(
        `Data ${createDto.blocked_date} já está bloqueada`,
      );
    }

    const blockedDate = this.blockedDateRepository.create(createDto);
    return await this.blockedDateRepository.save(blockedDate);
  }

  async findAllBlockedDates(
    startDate?: Date,
    endDate?: Date,
  ): Promise<BlockedDate[]> {
    const query = this.blockedDateRepository
      .createQueryBuilder('blocked_date')
      .orderBy('blocked_date.blocked_date', 'ASC');

    if (startDate) {
      query.andWhere('blocked_date.blocked_date >= :startDate', {
        startDate: this.normalizeDate(startDate),
      });
    }

    if (endDate) {
      query.andWhere('blocked_date.blocked_date <= :endDate', {
        endDate: this.normalizeDate(endDate),
      });
    }

    return await query.getMany();
  }

  async isDateBlocked(date: Date): Promise<boolean> {
    const blocked = await this.blockedDateRepository.findOne({
      where: { blocked_date: this.normalizeDate(date) },
    });
    return !!blocked;
  }

  async unblockDate(id: number): Promise<void> {
    const blocked = await this.blockedDateRepository.findOne({
      where: { id },
    });

    if (!blocked) {
      throw new NotFoundException(`Data bloqueada com ID ${id} não encontrada`);
    }

    await this.blockedDateRepository.remove(blocked);
  }

  // ==================== SPECIAL HOURS ====================

  async createSpecialHours(
    createDto: CreateSpecialHoursDto,
  ): Promise<SpecialHours> {
    const existing = await this.specialHoursRepository.findOne({
      where: { special_date: createDto.special_date },
    });

    if (existing) {
      throw new ConflictException(
        `Horário especial para data ${createDto.special_date} já existe`,
      );
    }

    const specialHours = this.specialHoursRepository.create(createDto);
    return await this.specialHoursRepository.save(specialHours);
  }

  async findAllSpecialHours(): Promise<SpecialHours[]> {
    return await this.specialHoursRepository.find({
      order: { special_date: 'ASC' },
    });
  }

  async findSpecialHoursByDate(date: Date): Promise<SpecialHours | null> {
    return await this.specialHoursRepository.findOne({
      where: { special_date: this.normalizeDate(date), is_active: true },
    });
  }

  async updateSpecialHours(
    id: number,
    updateDto: Partial<CreateSpecialHoursDto>,
  ): Promise<SpecialHours> {
    const specialHours = await this.specialHoursRepository.findOne({
      where: { id },
    });

    if (!specialHours) {
      throw new NotFoundException(
        `Horário especial com ID ${id} não encontrado`,
      );
    }

    Object.assign(specialHours, updateDto);
    return await this.specialHoursRepository.save(specialHours);
  }

  async deleteSpecialHours(id: number): Promise<void> {
    const specialHours = await this.specialHoursRepository.findOne({
      where: { id },
    });

    if (!specialHours) {
      throw new NotFoundException(
        `Horário especial com ID ${id} não encontrado`,
      );
    }

    await this.specialHoursRepository.remove(specialHours);
  }

  // ==================== BREAK TIMES ====================

  async createBreakTime(createDto: CreateBreakTimeDto): Promise<BreakTime> {
    const breakTime = this.breakTimeRepository.create(createDto);
    return await this.breakTimeRepository.save(breakTime);
  }

  async findBreaksByDate(date: Date): Promise<BreakTime[]> {
    return await this.breakTimeRepository.find({
      where: { break_date: this.normalizeDate(date) },
      order: { start_time: 'ASC' },
    });
  }

  async findBreaksByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<BreakTime[]> {
    return await this.breakTimeRepository.find({
      where: {
        break_date: Between(
          this.normalizeDate(startDate),
          this.normalizeDate(endDate),
        ),
      },
      order: { break_date: 'ASC', start_time: 'ASC' },
    });
  }

  async deleteBreakTime(id: number): Promise<void> {
    const breakTime = await this.breakTimeRepository.findOne({
      where: { id },
    });

    if (!breakTime) {
      throw new NotFoundException(`Pausa com ID ${id} não encontrada`);
    }

    await this.breakTimeRepository.remove(breakTime);
  }

  // ==================== UTILITÁRIOS ====================

  async getWorkingHoursForDate(date: Date): Promise<{
    is_working: boolean;
    start_time?: string;
    end_time?: string;
    slot_duration?: number;
    lunch_start?: string;
    lunch_end?: string;
    reason?: string;
  }> {
    date = this.normalizeDate(date);

    const isBlocked = await this.blockedDateRepository.findOne({
      where: { blocked_date: date, is_full_day: true },
    });

    if (isBlocked) {
      return { is_working: false, reason: isBlocked.reason };
    }

    const special = await this.specialHoursRepository.findOne({
      where: { special_date: date, is_active: true },
    });

    if (special) {
      return {
        is_working: true,
        start_time: special.start_time,
        end_time: special.end_time,
        slot_duration: special.slot_duration,
      };
    }

    const dayOfWeek = date.getDay();
    const schedule = await this.workScheduleRepository.findOne({
      where: { day_of_week: dayOfWeek, is_working: true },
    });

    if (!schedule) {
      return { is_working: false, reason: 'Barbearia fechada neste dia' };
    }

    return {
      is_working: true,
      start_time: schedule.start_time || '09:00',
      end_time: schedule.end_time || '19:00',
      slot_duration: schedule.slot_duration || 30,
      lunch_start: schedule.lunch_start,
      lunch_end: schedule.lunch_end,
    };
  }

  /**
   * ✅ Gerar slots para uma data específica
   * - Remove horários com agendamentos pendentes ou confirmados
   * - Se for hoje, remove horários que já passaram
   */
  async generateAvailableSlots(
    date: Date,
    includePast = false,
  ): Promise<string[]> {
    date = this.normalizeDate(date);
    const workingHours = await this.getWorkingHoursForDate(date);

    if (!workingHours.is_working) {
      return [];
    }

    if (!workingHours.start_time || !workingHours.end_time) {
      return [];
    }

    const breaks = await this.findBreaksByDate(date);

    // Normalizar tempos para formato HH:MM (remover segundos) vindo do DB
    const normalizeTime = (t?: string) => (t ? t.slice(0, 5) : undefined);

    const startTime = normalizeTime(workingHours.start_time)!;
    const endTime = normalizeTime(workingHours.end_time)!;
    const lunchStart = normalizeTime(workingHours.lunch_start);
    const lunchEnd = normalizeTime(workingHours.lunch_end);

    // Normalizar pausas (criar cópia simplificada)
    const normalizedBreaks = breaks.map((b) => ({
      ...b,
      start_time: normalizeTime(b.start_time),
      end_time: normalizeTime(b.end_time),
    }));

    // ✅ Buscar agendamentos ocupados (pending e confirmed)
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        appointment_date: date,
        status: In(['confirmed', 'pending']),
      },
    });

    const busyTimes = new Set(
      existingAppointments.map((a) =>
        a.appointment_time ? a.appointment_time.slice(0, 5) : undefined,
      ),
    );

    // ✅ Verificar se é hoje para filtrar horários passados
    const serverNow = new Date();
    // Converter para horário de São Paulo para comparação/filtragem
    const nowSP = new Date(
      serverNow.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
    const today = this.normalizeDate(nowSP);

    // ✅ CORRIGIDO: Comparar dia, mês e ano
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    const currentTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Sao_Paulo',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }).format(serverNow);

    const slots: string[] = [];
    let currentTimeSlot = startTime;
    const slotDuration = workingHours.slot_duration || 30;

    while (
      this.timeToMinutes(currentTimeSlot) + slotDuration <=
      this.timeToMinutes(endTime)
    ) {
      // Verificar horário de almoço
      if (lunchStart && lunchEnd) {
        if (currentTimeSlot >= lunchStart && currentTimeSlot < lunchEnd) {
          currentTimeSlot = lunchEnd;
          continue;
        }
      }

      // Verificar pausas
      let isBreak = false;
      for (const breakItem of normalizedBreaks) {
        if (
          breakItem.start_time &&
          breakItem.end_time &&
          currentTimeSlot >= breakItem.start_time &&
          currentTimeSlot < breakItem.end_time
        ) {
          currentTimeSlot = breakItem.end_time;
          isBreak = true;
          break;
        }
      }

      if (isBreak) continue;

      // ✅ Pular horários ocupados
      if (!busyTimes.has(currentTimeSlot)) {
        // ✅ Se for hoje, verificar se o horário já passou
        let isPastSlot = false;
        if (isToday && !includePast) {
          isPastSlot = currentTimeSlot < currentTime;
        }

        if (!isPastSlot) {
          slots.push(currentTimeSlot);
        }
      }

      currentTimeSlot = this.addMinutes(currentTimeSlot, slotDuration);
    }

    return slots;
  }

  async setupDefaultSchedule(): Promise<void> {
    const defaultSchedules = [
      { day_of_week: 0, is_working: false },
      {
        day_of_week: 1,
        is_working: true,
        start_time: '09:00',
        end_time: '19:00',
        slot_duration: 30,
      },
      {
        day_of_week: 2,
        is_working: true,
        start_time: '09:00',
        end_time: '19:00',
        slot_duration: 30,
      },
      {
        day_of_week: 3,
        is_working: true,
        start_time: '09:00',
        end_time: '19:00',
        slot_duration: 30,
      },
      {
        day_of_week: 4,
        is_working: true,
        start_time: '09:00',
        end_time: '19:00',
        slot_duration: 30,
      },
      {
        day_of_week: 5,
        is_working: true,
        start_time: '09:00',
        end_time: '19:00',
        slot_duration: 30,
      },
      {
        day_of_week: 6,
        is_working: true,
        start_time: '09:00',
        end_time: '16:00',
        slot_duration: 30,
      },
    ];

    for (const schedule of defaultSchedules) {
      const existing = await this.workScheduleRepository.findOne({
        where: { day_of_week: schedule.day_of_week },
      });

      if (!existing) {
        const newSchedule = this.workScheduleRepository.create(schedule);
        await this.workScheduleRepository.save(newSchedule);
      }
    }
  }

  // ==================== UTILITÁRIOS PRIVADOS ====================

  private timeToMinutes(time: string): number {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private addMinutes(time: string, minutes: number): string {
    if (!time) return '00:00';
    const totalMinutes = this.timeToMinutes(time) + minutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  }

  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
