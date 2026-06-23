/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/clients/services/clients.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan, LessThan } from 'typeorm';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  /**
   * Criar um novo cliente
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findOne({
      where: { phone: createClientDto.phone },
    });

    if (existingClient) {
      throw new ConflictException(
        `Cliente com telefone ${createClientDto.phone} já existe`,
      );
    }

    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  /**
   * Buscar ou criar cliente por telefone (útil para agendamentos)
   */
  async findOrCreate(createClientDto: CreateClientDto): Promise<Client> {
    const { phone } = createClientDto;

    let client = await this.clientRepository.findOne({
      where: { phone },
    });

    if (client) {
      if (
        client.name !== createClientDto.name &&
        (!client.name || client.name === '')
      ) {
        client.name = createClientDto.name;
        await this.clientRepository.save(client);
      }
      return client;
    }

    client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  /**
   * Buscar todos os clientes (com paginação)
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    clients: Client[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [clients, total] = await this.clientRepository.findAndCount({
      relations: {
        appointments: {
          service: true,
        },
      },
      order: { last_visit: 'DESC', total_appointments: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar cliente por ID
   */
  async findById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: {
        appointments: {
          service: true,
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return client;
  }

  /**
   * Buscar cliente por telefone
   */
  async findByPhone(phone: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { phone },
      relations: {
        appointments: {
          service: true,
        },
      },
    });

    if (!client) {
      throw new NotFoundException(
        `Cliente com telefone ${phone} não encontrado`,
      );
    }

    return client;
  }

  /**
   * Buscar clientes por nome (busca parcial)
   */
  async searchByName(name: string, limit: number = 10): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { name: Like(`%${name}%`), is_active: true },
      order: { total_appointments: 'DESC' },
      take: limit,
    });
  }

  /**
   * Atualizar dados do cliente
   */
  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);

    if (updateClientDto.phone && updateClientDto.phone !== client.phone) {
      const existingClient = await this.clientRepository.findOne({
        where: { phone: updateClientDto.phone },
      });
      if (existingClient) {
        throw new ConflictException(
          `Telefone ${updateClientDto.phone} já está em uso`,
        );
      }
    }

    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  /**
   * ✅ Atualizar estatísticas do cliente após um agendamento
   * CORRIGIDO: Garantir que o valor seja um número válido
   */
  async updateStats(id: number, appointmentValue: number): Promise<void> {
    const client = await this.findById(id);

    // ✅ Garantir que o valor é um número
    let numericValue: number;

    if (typeof appointmentValue === 'string') {
      const cleanValue = String(appointmentValue)
        .replace(/[^0-9.,]/g, '')
        .replace(',', '.');
      numericValue = parseFloat(cleanValue);
    } else if (typeof appointmentValue === 'number') {
      numericValue = appointmentValue;
    } else {
      numericValue = Number(appointmentValue);
    }

    // ✅ Verificar se é um número válido
    if (isNaN(numericValue) || numericValue <= 0) {
      console.warn(
        `⚠️ Valor inválido para updateStats: ${appointmentValue}. Usando 0.`,
      );
      numericValue = 0;
    }

    client.total_appointments += 1;
    client.total_spent += numericValue;
    client.last_visit = new Date();

    await this.clientRepository.save(client);
  }

  /**
   * Atualizar apenas a data da última visita
   */
  async updateLastVisit(id: number): Promise<void> {
    const client = await this.findById(id);
    client.last_visit = new Date();
    await this.clientRepository.save(client);
  }

  /**
   * Desativar cliente (soft delete)
   */
  async deactivate(id: number): Promise<void> {
    const client = await this.findById(id);
    client.is_active = false;
    await this.clientRepository.save(client);
  }

  /**
   * Reativar cliente
   */
  async activate(id: number): Promise<void> {
    const client = await this.findById(id);
    client.is_active = true;
    await this.clientRepository.save(client);
  }

  /**
   * Buscar clientes mais frequentes (top clientes)
   */
  async findTopClients(limit: number = 10): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { is_active: true },
      order: { total_appointments: 'DESC' },
      take: limit,
    });
  }

  /**
   * Buscar clientes que mais gastaram
   */
  async findTopSpenders(limit: number = 10): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { is_active: true },
      order: { total_spent: 'DESC' },
      take: limit,
    });
  }

  /**
   * Buscar clientes que não visitam há X dias (clientes inativos)
   */
  async findInactiveClients(daysInactive: number = 90): Promise<Client[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    return await this.clientRepository.find({
      where: {
        is_active: true,
        last_visit: LessThan(cutoffDate),
      },
      order: { last_visit: 'ASC' },
    });
  }

  /**
   * Buscar clientes que visitaram nos últimos X dias (clientes recentes)
   */
  async findRecentClients(daysRecent: number = 30): Promise<Client[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysRecent);

    return await this.clientRepository.find({
      where: {
        is_active: true,
        last_visit: MoreThan(cutoffDate),
      },
      order: { last_visit: 'DESC' },
    });
  }

  /**
   * Buscar histórico completo de agendamentos do cliente
   */
  async getAppointmentHistory(id: number) {
    const client = await this.findById(id);

    const history = client.appointments.sort(
      (a, b) =>
        new Date(b.appointment_date).getTime() -
        new Date(a.appointment_date).getTime(),
    );

    return {
      client: {
        id: client.id,
        name: client.name,
        phone: client.phone,
        total_appointments: client.total_appointments,
        total_spent: client.total_spent,
        last_visit: client.last_visit,
      },
      appointments: history,
    };
  }

  /**
   * Buscar próximos agendamentos do cliente (futuros)
   */
  async getUpcomingAppointments(id: number): Promise<any[]> {
    const client = await this.findById(id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return client.appointments
      .filter((app) => {
        const appDate = new Date(app.appointment_date);
        return appDate >= today && app.status !== 'cancelled';
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime(),
      );
  }

  /**
   * Buscar agendamentos passados do cliente
   */
  async getPastAppointments(id: number): Promise<any[]> {
    const client = await this.findById(id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return client.appointments
      .filter((app) => {
        const appDate = new Date(app.appointment_date);
        return appDate < today || app.status === 'completed';
      })
      .sort(
        (a, b) =>
          new Date(b.appointment_date).getTime() -
          new Date(a.appointment_date).getTime(),
      );
  }

  /**
   * Salvar preferências do cliente (JSON)
   */
  async savePreferences(id: number, preferences: any): Promise<Client> {
    const client = await this.findById(id);
    client.preferences = JSON.stringify(preferences);
    return await this.clientRepository.save(client);
  }

  /**
   * Buscar preferências do cliente
   */
  async getPreferences(id: number): Promise<any> {
    const client = await this.findById(id);
    return client.preferences ? JSON.parse(client.preferences) : {};
  }

  /**
   * Adicionar observação sobre o cliente
   */
  async addNote(id: number, note: string): Promise<Client> {
    const client = await this.findById(id);
    const existingNotes = client.notes || '';
    const newNote = `[${new Date().toLocaleDateString()}] ${note}\n`;
    client.notes = existingNotes + newNote;
    return await this.clientRepository.save(client);
  }

  /**
   * Estatísticas gerais de clientes
   */
  async getStats(): Promise<any> {
    const totalClients = await this.clientRepository.count();
    const activeClients = await this.clientRepository.count({
      where: { is_active: true },
    });

    const totalSpent = await this.clientRepository
      .createQueryBuilder('client')
      .select('SUM(client.total_spent)', 'total')
      .getRawOne();

    const avgAppointments = await this.clientRepository
      .createQueryBuilder('client')
      .select('AVG(client.total_appointments)', 'avg')
      .getRawOne();

    return {
      total_clients: totalClients,
      active_clients: activeClients,
      total_revenue: totalSpent.total || 0,
      average_appointments_per_client:
        Number(avgAppointments.avg).toFixed(2) || 0,
    };
  }

  /**
   * Deletar cliente (apenas admin, uso restrito)
   */
  async delete(id: number): Promise<void> {
    const client = await this.findById(id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureAppointments = client.appointments.filter((app) => {
      const appDate = new Date(app.appointment_date);
      return appDate >= today && app.status !== 'cancelled';
    });

    if (futureAppointments.length > 0) {
      throw new BadRequestException(
        `Cliente possui ${futureAppointments.length} agendamento(s) futuro(s). Remova ou cancele os agendamentos primeiro.`,
      );
    }

    await this.clientRepository.remove(client);
  }
}
