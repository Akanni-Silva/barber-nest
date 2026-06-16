/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Criar um novo produto/serviço
   * POST /products
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateProductDto) {
    return await this.productsService.create(createDto);
  }

  /**
   * Listar todos os produtos (apenas ativos)
   * GET /products
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.productsService.findAll(page, limit);
  }

  /**
   * Listar todos os produtos (incluindo inativos)
   * GET /products/all
   */
  @Get('all')
  async findAllWithInactive(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return await this.productsService.findAllWithInactive(page, limit);
  }

  /**
   * Listar apenas produtos ativos
   * GET /products/active
   */
  @Get('active')
  async findActive() {
    return await this.productsService.findActive();
  }

  /**
   * Estatísticas dos produtos
   * GET /products/stats
   */
  @Get('stats')
  async getStats() {
    return await this.productsService.getStats();
  }

  /**
   * Produtos mais populares (mais agendados)
   * GET /products/popular
   */
  @Get('popular')
  async getMostPopular(@Query('limit') limit: number = 5) {
    return await this.productsService.findMostPopular(limit);
  }

  /**
   * Buscar produtos por nome (busca parcial)
   * GET /products/search?name=corte
   */
  @Get('search')
  async searchByName(@Query('name') name: string) {
    return await this.productsService.findByName(name);
  }

  /**
   * Buscar produtos por faixa de preço
   * GET /products/price-range?min=30&max=80
   */
  @Get('price-range')
  async findByPriceRange(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number,
  ) {
    return await this.productsService.findByPriceRange(min, max);
  }

  /**
   * Buscar produtos por duração máxima
   * GET /products/duration?max=60
   */
  @Get('duration')
  async findByDuration(@Query('max', ParseIntPipe) max: number) {
    return await this.productsService.findByDuration(max);
  }

  /**
   * Buscar produto por ID
   * GET /products/1
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findById(id);
  }

  /**
   * Atualizar produto
   * PUT /products/1
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateDto);
  }

  /**
   * Ativar produto
   * PUT /products/1/activate
   */
  @Put(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.activate(id);
  }

  /**
   * Desativar produto
   * PUT /products/1/deactivate
   */
  @Put(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deactivate(id);
  }

  /**
   * Deletar produto
   * DELETE /products/1
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.delete(id);
    return {
      message: 'Produto removido com sucesso',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Criar múltiplos produtos (bulk)
   * POST /products/bulk
   */
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() createDtos: CreateProductDto[]) {
    return await this.productsService.createMany(createDtos);
  }
}
