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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ❌ PROTEGIDO - Apenas barbeiro
  @Post()
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar produto ou serviço (barbeiro)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Produto já existe' })
  async create(@Body() createDto: CreateProductDto) {
    return await this.productsService.create(createDto);
  }

  // ✅ PÚBLICO - Clientes podem ver serviços
  @Get()
  @ApiOperation({ summary: 'Listar produtos ativos (público)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.productsService.findAll(page, limit);
  }

  // ✅ PÚBLICO - Clientes podem ver serviços ativos
  @Get('active')
  @ApiOperation({ summary: 'Listar produtos ativos (público)' })
  @ApiResponse({ status: 200, description: 'Lista de produtos ativos' })
  async findActive() {
    return await this.productsService.findActive();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('stats')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Estatísticas de produtos (barbeiro)' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getStats() {
    return await this.productsService.getStats();
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Get('popular')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Listar produtos mais populares (barbeiro)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de resultados',
  })
  @ApiResponse({ status: 200, description: 'Produtos mais populares' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getMostPopular(@Query('limit') limit: number = 5) {
    return await this.productsService.findMostPopular(limit);
  }

  // ✅ PÚBLICO - Clientes podem buscar serviços
  @Get('search')
  @ApiOperation({ summary: 'Buscar produtos por nome (público)' })
  @ApiQuery({ name: 'name', description: 'Nome do produto' })
  @ApiResponse({ status: 200, description: 'Lista de produtos encontrados' })
  async searchByName(@Query('name') name: string) {
    return await this.productsService.findByName(name);
  }

  // ✅ PÚBLICO - Clientes podem filtrar por preço
  @Get('price-range')
  @ApiOperation({ summary: 'Buscar produtos por faixa de preço (público)' })
  @ApiQuery({ name: 'min', type: Number, description: 'Preço mínimo' })
  @ApiQuery({ name: 'max', type: Number, description: 'Preço máximo' })
  @ApiResponse({ status: 200, description: 'Lista de produtos encontrados' })
  async findByPriceRange(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number,
  ) {
    return await this.productsService.findByPriceRange(min, max);
  }

  // ✅ PÚBLICO - Clientes podem ver detalhes do serviço
  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID (público)' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findById(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Atualizar produto (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 409, description: 'Produto já existe' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateDto);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/activate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Ativar produto (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto ativado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async activate(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.activate(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Desativar produto (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto desativado' })
  @ApiResponse({ status: 400, description: 'Não é possível desativar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deactivate(id);
  }

  // ❌ PROTEGIDO - Apenas barbeiro
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar produto (barbeiro)' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto removido' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.delete(id);
    return { message: 'Produto removido com sucesso' };
  }
}
