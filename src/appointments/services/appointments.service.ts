/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, In, DataSource } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { ClientsService } from '../../clients/services/clients.service';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  /**
   * ✅ Criar um novo agendamento com validação CORRETA de horário
   */

  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    // 1. Validar dados obrigatórios
    if (!createDto.client_name || !createDto.client_phone) {
      throw new BadRequestException(
        'Nome e telefone do cliente são obrigatórios',
      );
    }

    if (!createDto.service_id) {
      throw new BadRequestException('ID do serviço é obrigatório');
    }

    if (!createDto.appointment_date || !createDto.appointment_time) {
      throw new BadRequestException('Data e horário são obrigatórios');
    }

    // 2. Buscar ou criar cliente
    const client = await this.clientsService.findOrCreate({
      name: createDto.client_name,
      phone: createDto.client_phone,
    });

    // 3. Verificar se serviço existe
    const service = await this.productsService.findById(createDto.service_id);
    if (!service) {
      throw new NotFoundException(
        `Serviço com ID ${createDto.service_id} não encontrado`,
      );
    }

    // 4. Validar formato do horário
    const timeParts = createDto.appointment_time.split(':');
    if (timeParts.length < 2) {
      throw new BadRequestException(
        `Formato de horário inválido: ${createDto.appointment_time}. Use HH:mm ou HH:mm:ss`,
      );
    }

    // Garantir que o horário tenha segundos (HH:mm:ss)
    let formattedTime = createDto.appointment_time;
    if (timeParts.length === 2) {
      formattedTime = `${createDto.appointment_time}:00`;
    }

    // Validar se horas e minutos são números válidos
    const [hours, minutes] = formattedTime.split(':').map(Number);
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException(`Horário inválido: ${formattedTime}`);
    }

    // ✅ 5. Validar se a data/hora é no futuro
    const now = new Date();

    // ✅ CORRIGIDO: Converter Date para string com toISOString()
    let dateStr: string;
    if (createDto.appointment_date instanceof Date) {
      dateStr = createDto.appointment_date.toISOString().split('T')[0];
    } else {
      dateStr = String(createDto.appointment_date);
    }

    const [year, month, day] = dateStr.split('-').map(Number);

    // ✅ Criar data no timezone local usando horas e minutos do formattedTime
    const timeZoneOffset = process.env.TZ || '-03:00';
    const appointmentDate = new Date(
      `${dateStr}T${formattedTime}${timeZoneOffset}`,
    );

    // Rejeita apenas se o horário já passou no momento da requisição
    if (appointmentDate.getTime() < now.getTime() - 2 * 60 * 1000) {
      throw new BadRequestException(
        `Não é possível agendar para um horário que já passou (${formattedTime})`,
      );
    }

    // 6. Usar transação com lock pessimista
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 7. Verificar disponibilidade com LOCK (FOR UPDATE)
      const existing = await queryRunner.manager
        .createQueryBuilder(Appointment, 'appointment')
        .where(
          'appointment.appointment_date = :date AND appointment.appointment_time = :time',
          {
            date: createDto.appointment_date,
            time: formattedTime,
          },
        )
        .andWhere('appointment.status IN (:...statuses)', {
          statuses: ['pending', 'confirmed'],
        })
        .setLock('pessimistic_write')
        .getOne();

      if (existing) {
        throw new ConflictException('Horário não está mais disponível');
      }

      // 8. Criar agendamento
      const appointment = new Appointment();
      appointment.client = client;
      appointment.client_id = client.id;
      appointment.service = service;
      appointment.service_id = service.id;
      appointment.appointment_date = createDto.appointment_date;
      appointment.appointment_time = formattedTime;
      appointment.notes = createDto.notes || '';
      appointment.status = 'pending';

      const savedAppointment = await queryRunner.manager.save(appointment);
      await queryRunner.commitTransaction();

      return savedAppointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Buscar todos agendamentos (com filtros)
   */
  async findAll(filters?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ appointments: Appointment[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.client', 'client')
      .leftJoinAndSelect('appointment.service', 'service');

    if (filters?.status) {
      query.andWhere('appointment.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.startDate) {
      query.andWhere('appointment.appointment_date >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('appointment.appointment_date <= :endDate', {
        endDate: filters.endDate,
      });
    }

    query
      .orderBy('appointment.appointment_date', 'ASC')
      .addOrderBy('appointment.appointment_time', 'ASC')
      .skip(skip)
      .take(limit);

    const [appointments, total] = await query.getManyAndCount();

    return { appointments, total };
  }

  /**
   * Buscar agendamento por ID
   */
  async findById(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: {
        client: true,
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    return appointment;
  }

  /**
   * Buscar agendamentos por cliente
   */
  async findByClient(clientId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { client: { id: clientId } },
      relations: {
        service: true,
      },
      order: {
        appointment_date: 'DESC',
        appointment_time: 'DESC',
      },
    });
  }

  /**
   * Buscar agendamentos do dia
   */
  async findToday(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.appointmentRepository.find({
      where: {
        appointment_date: Between(today, tomorrow),
        status: In(['pending', 'confirmed']),
      },
      relations: {
        client: true,
        service: true,
      },
      order: {
        appointment_time: 'ASC',
      },
    });
  }

  /**
   * Buscar agendamentos futuros
   */
  async findUpcoming(limit: number = 10): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.appointmentRepository.find({
      where: {
        appointment_date: MoreThan(today),
        status: In(['pending', 'confirmed']),
      },
      relations: {
        client: true,
        service: true,
      },
      order: {
        appointment_date: 'ASC',
        appointment_time: 'ASC',
      },
      take: limit,
    });
  }

  /**
   * Confirmar agendamento
   */
  async confirm(id: number): Promise<Appointment> {
    const appointment = await this.findById(id);

    if (appointment.status !== 'pending') {
      throw new BadRequestException(
        `Não é possível confirmar um agendamento com status ${appointment.status}`,
      );
    }

    appointment.status = 'confirmed';
    const updated = await this.appointmentRepository.save(appointment);

    // Garantir que o preço é um número
    const price =
      typeof appointment.service.price === 'string'
        ? parseFloat(appointment.service.price)
        : appointment.service.price;

    // Atualizar estatísticas do cliente
    await this.clientsService.updateStats(appointment.client.id, price);

    return updated;
  }

  /**
   * Completar agendamento (atendimento finalizado)
   */
  async complete(id: number): Promise<Appointment> {
    const appointment = await this.findById(id);

    if (appointment.status !== 'confirmed') {
      throw new BadRequestException(
        `Não é possível completar um agendamento com status ${appointment.status}`,
      );
    }

    appointment.status = 'completed';
    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Cancelar agendamento
   */
  async cancel(id: number, reason?: string): Promise<Appointment> {
    const appointment = await this.findById(id);

    if (appointment.status === 'completed') {
      throw new BadRequestException(
        'Não é possível cancelar um agendamento já concluído',
      );
    }

    appointment.status = 'cancelled';
    appointment.notes = reason
      ? `${appointment.notes || ''}\nCancelamento: ${reason}`
      : appointment.notes;

    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Verificar disponibilidade de horário (método auxiliar)
   */
  private async checkAvailability(date: Date, time: string): Promise<boolean> {
    const count = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.appointment_date = :date', { date })
      .andWhere('appointment.appointment_time = :time', { time })
      .andWhere('appointment.status IN (:...statuses)', {
        statuses: ['pending', 'confirmed'],
      })
      .getCount();

    return count === 0;
  }

  /**
   * Reagendar um agendamento
   */
  async reschedule(
    id: number,
    newDate: Date,
    newTime: string,
  ): Promise<Appointment> {
    const appointment = await this.findById(id);

    if (appointment.status === 'completed') {
      throw new BadRequestException(
        'Não é possível reagendar um agendamento já concluído',
      );
    }

    // Validar formato do horário
    const timeParts = newTime.split(':');
    if (timeParts.length < 2) {
      throw new BadRequestException(
        'Formato de horário inválido. Use HH:mm ou HH:mm:ss',
      );
    }

    let formattedTime = newTime;
    if (timeParts.length === 2) {
      formattedTime = `${newTime}:00`;
    }

    // Validar se a nova data/hora é no futuro (APENAS PARA HOJE)
    const [hours, minutes] = formattedTime.split(':').map(Number);
    const appointmentDate = new Date(newDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const appointmentDateStr = new Date(newDate).toISOString().split('T')[0];

    if (appointmentDateStr === todayStr) {
      const diffMinutes = (appointmentDate.getTime() - now.getTime()) / 60000;
      if (diffMinutes < -2) {
        throw new BadRequestException(
          'Não é possível reagendar para um horário que já passou',
        );
      }
    }

    const isAvailable = await this.checkAvailability(newDate, formattedTime);
    if (!isAvailable) {
      throw new ConflictException('Horário não está disponível');
    }

    appointment.appointment_date = newDate;
    appointment.appointment_time = formattedTime;
    appointment.status = 'pending';

    return await this.appointmentRepository.save(appointment);
  }

  /**
   * Estatísticas de agendamentos
   */
  async getStats(): Promise<any> {
    const total = await this.appointmentRepository.count();
    const pending = await this.appointmentRepository.count({
      where: { status: 'pending' },
    });
    const confirmed = await this.appointmentRepository.count({
      where: { status: 'confirmed' },
    });
    const completed = await this.appointmentRepository.count({
      where: { status: 'completed' },
    });
    const cancelled = await this.appointmentRepository.count({
      where: { status: 'cancelled' },
    });

    const revenueResult = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.service', 'service')
      .where('appointment.status = :status', { status: 'completed' })
      .select('SUM(service.price)', 'total')
      .getRawOne();

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      total_revenue: Number(revenueResult?.total ?? 0),
    };
  }

  /**
   * Deletar agendamento (apenas se pendente ou cancelado)
   */
  async delete(id: number): Promise<void> {
    const appointment = await this.findById(id);

    if (
      appointment.status !== 'pending' &&
      appointment.status !== 'cancelled'
    ) {
      throw new BadRequestException(
        'Só é possível deletar agendamentos pendentes ou cancelados',
      );
    }

    await this.appointmentRepository.remove(appointment);
  }

  /**
   * Atualizar agendamento
   */
  async update(
    id: number,
    updateDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findById(id);

    if (appointment.status === 'completed') {
      throw new BadRequestException(
        'Não é possível atualizar um agendamento já concluído',
      );
    }

    if (updateDto.appointment_date || updateDto.appointment_time) {
      const newDate =
        updateDto.appointment_date || appointment.appointment_date;
      let newTime = updateDto.appointment_time || appointment.appointment_time;

      if (
        newDate !== appointment.appointment_date ||
        newTime !== appointment.appointment_time
      ) {
        // Validar formato do horário
        const timeParts = newTime.split(':');
        if (timeParts.length < 2) {
          throw new BadRequestException(
            'Formato de horário inválido. Use HH:mm ou HH:mm:ss',
          );
        }

        if (timeParts.length === 2) {
          newTime = `${newTime}:00`;
        }

        // Validar se a nova data/hora é no futuro (APENAS PARA HOJE)
        const [hours, minutes] = newTime.split(':').map(Number);
        const appointmentDate = new Date(newDate);
        appointmentDate.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const appointmentDateStr = new Date(newDate)
          .toISOString()
          .split('T')[0];

        if (appointmentDateStr === todayStr) {
          const diffMinutes =
            (appointmentDate.getTime() - now.getTime()) / 60000;
          if (diffMinutes < -2) {
            throw new BadRequestException(
              'Não é possível atualizar para um horário que já passou',
            );
          }
        }

        const isAvailable = await this.checkAvailability(newDate, newTime);
        if (!isAvailable) {
          throw new ConflictException('Horário não está disponível');
        }

        appointment.appointment_date = newDate;
        appointment.appointment_time = newTime;
      }
    }

    if (updateDto.notes !== undefined) {
      appointment.notes = updateDto.notes;
    }

    return await this.appointmentRepository.save(appointment);
  }
}
