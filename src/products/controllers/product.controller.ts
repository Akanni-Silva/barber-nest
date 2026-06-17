/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/products/controllers/products.controller.ts
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
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { BarberGuard } from '../../auth/guard/barber.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post()
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateProductDto) {
    return await this.productsService.create(createDto);
  }

  // ✅ PÚBLICO - Clientes podem ver serviços
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.productsService.findAll(page, limit);
  }

  // ✅ PÚBLICO - Clientes podem ver serviços ativos
  @Get('active')
  async findActive() {
    return await this.productsService.findActive();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('stats')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getStats() {
    return await this.productsService.getStats();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('popular')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async getMostPopular(@Query('limit') limit: number = 5) {
    return await this.productsService.findMostPopular(limit);
  }

  // ✅ PÚBLICO - Clientes podem buscar serviços
  @Get('search')
  async searchByName(@Query('name') name: string) {
    return await this.productsService.findByName(name);
  }

  // ✅ PÚBLICO - Clientes podem filtrar por preço
  @Get('price-range')
  async findByPriceRange(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number,
  ) {
    return await this.productsService.findByPriceRange(min, max);
  }

  // ✅ PÚBLICO - Clientes podem ver detalhes do serviço
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findById(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/activate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async activate(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.activate(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deactivate(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.delete(id);
    return { message: 'Produto removido com sucesso' };
  }
}
