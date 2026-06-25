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
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ✅ PÚBLICO - Cliente pode se cadastrar
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar cliente (público)' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Telefone já está em uso' })
  async create(@Body() createDto: CreateClientDto) {
    return await this.clientsService.create(createDto);
  }

  // ✅ PÚBLICO - Usado no agendamento
  @Post('find-or-create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar ou criar cliente (público)' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado ou criado' })
  async findOrCreate(@Body() createDto: CreateClientDto) {
    return await this.clientsService.findOrCreate(createDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get()
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar clientes (barbeiro)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.clientsService.findAll(page, limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('search')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar clientes por nome (barbeiro)' })
  @ApiQuery({ name: 'name', description: 'Nome do cliente' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes encontrados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async searchByName(
    @Query('name') name: string,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.clientsService.searchByName(name, limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('top')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar clientes mais frequentes (barbeiro)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes frequentes' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getTopClients(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.clientsService.findTopClients(limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('top-spenders')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar clientes que mais gastaram (barbeiro)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes por gasto' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getTopSpenders(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.clientsService.findTopSpenders(limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('inactive')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar clientes inativos (barbeiro)' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Dias sem visita',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes inativos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getInactiveClients(@Query('days', ParseIntPipe) days: number = 90) {
    return await this.clientsService.findInactiveClients(days);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('recent')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar clientes recentes (barbeiro)' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Dias recentes',
  })
  @ApiResponse({ status: 200, description: 'Lista de clientes recentes' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getRecentClients(@Query('days', ParseIntPipe) days: number = 30) {
    return await this.clientsService.findRecentClients(days);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('stats')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Estatísticas de clientes (barbeiro)' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getStats() {
    return await this.clientsService.getStats();
  }

  // ✅ PÚBLICO - Cliente pode consultar próprio cadastro (opcional)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID (público)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.findById(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('phone/:phone')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar cliente por telefone (barbeiro)' })
  @ApiParam({ name: 'phone', description: 'Telefone do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByPhone(@Param('phone') phone: string) {
    return await this.clientsService.findByPhone(phone);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/history')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar histórico do cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Histórico do cliente' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async getHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getAppointmentHistory(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/upcoming')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({
    summary: 'Buscar próximos agendamentos do cliente (barbeiro)',
  })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Próximos agendamentos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async getUpcoming(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getUpcomingAppointments(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/past')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({
    summary: 'Buscar agendamentos passados do cliente (barbeiro)',
  })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Agendamentos passados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async getPast(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getPastAppointments(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/preferences')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar preferências do cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Preferências do cliente' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async getPreferences(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getPreferences(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Atualizar cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'Telefone já está em uso' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateClientDto,
  ) {
    return await this.clientsService.update(id, updateDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/preferences')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Salvar preferências do cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Preferências salvas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async savePreferences(
    @Param('id', ParseIntPipe) id: number,
    @Body() preferences: any,
  ) {
    return await this.clientsService.savePreferences(id, preferences);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post(':id/notes')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Adicionar observação ao cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Observação adicionada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body('note') note: string,
  ) {
    return await this.clientsService.addNote(id, note);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desativar cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente desativado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.deactivate(id);
    return { message: 'Cliente desativado com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reativar cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente reativado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async activate(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.activate(id);
    return { message: 'Cliente reativado com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar cliente (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente removido' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.delete(id);
    return { message: 'Cliente removido com sucesso' };
  }
}
