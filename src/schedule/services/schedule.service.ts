/* eslint-disable @typescript-eslint/restrict-template-expressions */
// src/schedule/services/schedule.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';

import { WorkSchedule } from '../entities/work-schedule.entity';
import { BlockedDate } from '../entities/blocked-date.entity';
import { SpecialHours } from '../entities/special-hours.entity';
import { BreakTime } from '../entities/break-time.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { CreateWorkScheduleDto } from '../dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from '../dto/update-work-schedule.dto';
import { CreateBlockedDateDto } from '../dto/create-blocked-date.dto';
import { CreateSpecialHoursDto } from '../dto/create-special-hours.dto';
import { CreateBreakTimeDto } from '../dto/create-break-time.dto';

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
      query.andWhere('blocked_date.blocked_date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('blocked_date.blocked_date <= :endDate', { endDate });
    }

    return await query.getMany();
  }

  async isDateBlocked(date: Date): Promise<boolean> {
    const blocked = await this.blockedDateRepository.findOne({
      where: { blocked_date: date },
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
      where: { special_date: date, is_active: true },
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
      where: { break_date: date },
      order: { start_time: 'ASC' },
    });
  }

  async findBreaksByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<BreakTime[]> {
    return await this.breakTimeRepository.find({
      where: {
        break_date: Between(startDate, endDate),
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
   * Gerar slots disponíveis para uma data
   */
  async generateAvailableSlots(
    date: Date,
    serviceDuration: number = 30,
  ): Promise<string[]> {
    const workingHours = await this.getWorkingHoursForDate(date);

    if (!workingHours.is_working) {
      return [];
    }

    if (!workingHours.start_time || !workingHours.end_time) {
      return [];
    }

    const breaks = await this.findBreaksByDate(date);

    // Buscar agendamentos ocupados (pending e confirmed)
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        appointment_date: date,
        status: In(['confirmed', 'pending']),
      },
    });

    const busyTimes = new Set(
      existingAppointments.map((a) => a.appointment_time),
    );

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const slots: string[] = [];
    let currentTimeSlot = workingHours.start_time;
    const endTime = workingHours.end_time;
    const slotDuration = workingHours.slot_duration || 30;

    while (
      this.timeToMinutes(currentTimeSlot) + serviceDuration <=
      this.timeToMinutes(endTime)
    ) {
      // Verificar horário de almoço
      if (workingHours.lunch_start && workingHours.lunch_end) {
        if (
          currentTimeSlot >= workingHours.lunch_start &&
          currentTimeSlot < workingHours.lunch_end
        ) {
          currentTimeSlot = workingHours.lunch_end;
          continue;
        }
      }

      // Verificar pausas
      let isBreak = false;
      for (const breakItem of breaks) {
        if (
          currentTimeSlot >= breakItem.start_time &&
          currentTimeSlot < breakItem.end_time
        ) {
          currentTimeSlot = breakItem.end_time;
          isBreak = true;
          break;
        }
      }

      if (isBreak) continue;

      // Pular horários ocupados
      if (!busyTimes.has(currentTimeSlot)) {
        // Verificar se o horário é no futuro (apenas para hoje)
        const isPastSlot =
          date.toISOString().split('T')[0] === todayStr &&
          currentTimeSlot < currentTime;

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
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
