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
} from '@nestjs/common';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ✅ PÚBLICO - Cliente pode se cadastrar
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateClientDto) {
    return await this.clientsService.create(createDto);
  }

  // ✅ PÚBLICO - Usado no agendamento
  @Post('find-or-create')
  @HttpCode(HttpStatus.OK)
  async findOrCreate(@Body() createDto: CreateClientDto) {
    return await this.clientsService.findOrCreate(createDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get()
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.clientsService.findAll(page, limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('search')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async searchByName(
    @Query('name') name: string,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.clientsService.searchByName(name, limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('top')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getTopClients(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.clientsService.findTopClients(limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('top-spenders')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getTopSpenders(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.clientsService.findTopSpenders(limit);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('inactive')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getInactiveClients(@Query('days', ParseIntPipe) days: number = 90) {
    return await this.clientsService.findInactiveClients(days);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('recent')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getRecentClients(@Query('days', ParseIntPipe) days: number = 30) {
    return await this.clientsService.findRecentClients(days);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('stats')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getStats() {
    return await this.clientsService.getStats();
  }

  // ✅ PÚBLICO - Cliente pode consultar próprio cadastro (opcional)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.findById(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('phone/:phone')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async findByPhone(@Param('phone') phone: string) {
    return await this.clientsService.findByPhone(phone);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/history')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getAppointmentHistory(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/upcoming')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getUpcoming(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getUpcomingAppointments(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/past')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getPast(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getPastAppointments(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get(':id/preferences')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getPreferences(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.getPreferences(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateClientDto,
  ) {
    return await this.clientsService.update(id, updateDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/preferences')
  @UseGuards(JwtAuthGuard, BarberGuard)
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
  async addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body('note') note: string,
  ) {
    return await this.clientsService.addNote(id, note);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete(':id/deactivate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.deactivate(id);
    return { message: 'Cliente desativado com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post(':id/activate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.activate(id);
    return { message: 'Cliente reativado com sucesso' };
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.delete(id);
    return { message: 'Cliente removido com sucesso' };
  }
}
