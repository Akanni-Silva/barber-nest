/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/clients/controllers/clients.controller.ts
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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Criar um novo cliente
   * POST /clients
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateClientDto) {
    return await this.clientsService.create(createDto);
  }

  /**
   * Buscar ou criar cliente por telefone (útil para agendamentos)
   * POST /clients/find-or-create
   */
  @Post('find-or-create')
  @HttpCode(HttpStatus.OK)
  async findOrCreate(@Body() createDto: CreateClientDto) {
    return await this.clientsService.findOrCreate(createDto);
  }

  /**
   * Listar todos os clientes (paginado)
   * GET /clients?page=1&limit=20
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.clientsService.findAll(page, limit);
  }

  /**
   * Buscar clientes por nome (busca parcial)
   * GET /clients/search?name=joao&limit=10
   */
  @Get('search')
  async searchByName(
    @Query('name') name: string,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.clientsService.searchByName(name, limit);
  }

  /**
   * Buscar clientes mais frequentes (top clientes)
   * GET /clients/top?limit=10
   */
  @Get('top')
  async getTopClients(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.clientsService.findTopClients(limit);
  }

  /**
   * Buscar clientes que mais gastaram
   * GET /clients/top-spenders?limit=10
   */
  @Get('top-spenders')
  async getTopSpenders(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.clientsService.findTopSpenders(limit);
  }

  /**
   * Buscar clientes inativos (sem visita há X dias)
   * GET /clients/inactive?days=90
   */
  @Get('inactive')
  async getInactiveClients(@Query('days', ParseIntPipe) days: number = 90) {
    return await this.clientsService.findInactiveClients(days);
  }

  /**
   * Buscar clientes recentes (visitaram nos últimos X dias)
   * GET /clients/recent?days=30
   */
  @Get('recent')
  async getRecentClients(@Query('days', ParseIntPipe) days: number = 30) {
    return await this.clientsService.findRecentClients(days);
  }

  /**
   * Estatísticas gerais de clientes
   * GET /clients/stats
   */
  @Get('stats')
  async getStats() {
    return await this.clientsService.getStats();
  }

  /**
   * Buscar cliente por ID
   * GET /clients/1
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.findById(id);
  }

  /**
   * Buscar cliente por telefone
   * GET /clients/phone/+5511999999999
   */
  @Get('phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    return await this.clientsService.findByPhone(phone);
  }

  /**
   * Buscar histórico completo de agendamentos do cliente
   * GET /clients/1/history
   */
  @Get(':id/history')
  async getHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getAppointmentHistory(id);
  }

  /**
   * Buscar próximos agendamentos do cliente (futuros)
   * GET /clients/1/upcoming
   */
  @Get(':id/upcoming')
  async getUpcoming(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getUpcomingAppointments(id);
  }

  /**
   * Buscar agendamentos passados do cliente
   * GET /clients/1/past
   */
  @Get(':id/past')
  async getPast(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getPastAppointments(id);
  }

  /**
   * Buscar preferências do cliente
   * GET /clients/1/preferences
   */
  @Get(':id/preferences')
  async getPreferences(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getPreferences(id);
  }

  /**
   * Atualizar dados do cliente
   * PUT /clients/1
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateClientDto,
  ) {
    return await this.clientsService.update(id, updateDto);
  }

  /**
   * Salvar preferências do cliente
   * PUT /clients/1/preferences
   */
  @Put(':id/preferences')
  async savePreferences(
    @Param('id', ParseIntPipe) id: number,
    @Body() preferences: any,
  ) {
    return await this.clientsService.savePreferences(id, preferences);
  }

  /**
   * Adicionar observação sobre o cliente
   * POST /clients/1/notes
   */
  @Post(':id/notes')
  @HttpCode(HttpStatus.OK)
  async addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body('note') note: string,
  ) {
    return await this.clientsService.addNote(id, note);
  }

  /**
   * Desativar cliente (soft delete)
   * DELETE /clients/1/deactivate
   */
  @Delete(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.deactivate(id);
    return {
      message: 'Cliente desativado com sucesso',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Reativar cliente
   * POST /clients/1/activate
   */
  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.activate(id);
    return {
      message: 'Cliente reativado com sucesso',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Deletar cliente (apenas se não tiver agendamentos futuros)
   * DELETE /clients/1
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.delete(id);
    return {
      message: 'Cliente removido com sucesso',
      statusCode: HttpStatus.OK,
    };
  }
}
