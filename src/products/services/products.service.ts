/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/products/services/products.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThanOrEqual } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Criar um novo produto/serviço
   */
  async create(createDto: CreateProductDto): Promise<Product> {
    // Verificar se produto com mesmo nome já existe
    const existingProduct = await this.productRepository.findOne({
      where: { name: createDto.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Produto com nome "${createDto.name}" já existe`,
      );
    }

    const product = this.productRepository.create(createDto);
    return await this.productRepository.save(product);
  }

  /**
   * Buscar todos os produtos (com paginação)
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [products, total] = await this.productRepository.findAndCount({
      where: { is_active: true },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar todos os produtos (incluindo inativos)
   */
  async findAllWithInactive(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [products, total] = await this.productRepository.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Buscar produto por ID
   */
  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { appointments: true },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  /**
   * Buscar produto por nome
   */
  async findByName(name: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { name: Like(`%${name}%`), is_active: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Buscar apenas produtos ativos
   */
  async findActive(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Atualizar produto
   */
  async update(id: number, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);

    // Se estiver atualizando o nome, verificar conflito
    if (updateDto.name && updateDto.name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateDto.name },
      });
      if (existingProduct) {
        throw new ConflictException(
          `Produto com nome "${updateDto.name}" já existe`,
        );
      }
    }

    Object.assign(product, updateDto);
    return await this.productRepository.save(product);
  }

  /**
   * Ativar produto
   */
  async activate(id: number): Promise<Product> {
    const product = await this.findById(id);
    product.is_active = true;
    return await this.productRepository.save(product);
  }

  /**
   * Desativar produto (soft delete)
   */
  async deactivate(id: number): Promise<Product> {
    const product = await this.findById(id);

    // Verificar se produto tem agendamentos futuros
    const hasFutureAppointments = product.appointments?.some((app) => {
      const appointmentDate = new Date(app.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today && app.status !== 'cancelled';
    });

    if (hasFutureAppointments) {
      throw new BadRequestException(
        'Não é possível desativar um produto que possui agendamentos futuros',
      );
    }

    product.is_active = false;
    return await this.productRepository.save(product);
  }

  /**
   * Deletar produto (apenas se não tiver agendamentos)
   */
  async delete(id: number): Promise<void> {
    const product = await this.findById(id);

    if (product.appointments && product.appointments.length > 0) {
      throw new BadRequestException(
        `Não é possível deletar o produto "${product.name}" pois existem ${product.appointments.length} agendamentos vinculados`,
      );
    }

    await this.productRepository.remove(product);
  }

  /**
   * Estatísticas dos produtos
   */
  async getStats(): Promise<any> {
    const total = await this.productRepository.count();
    const active = await this.productRepository.count({
      where: { is_active: true },
    });
    const inactive = total - active;

    // Produto mais caro
    const mostExpensive = await this.productRepository.findOne({
      where: { is_active: true },
      order: { price: 'DESC' },
    });

    // Produto mais barato
    const cheapest = await this.productRepository.findOne({
      where: { is_active: true },
      order: { price: 'ASC' },
    });

    // Média de preços
    const avgPriceResult = await this.productRepository
      .createQueryBuilder('product')
      .select('AVG(product.price)', 'average')
      .where('product.is_active = :is_active', { is_active: true })
      .getRawOne();

    return {
      total_products: total,
      active_products: active,
      inactive_products: inactive,
      average_price: Number(avgPriceResult?.average || 0).toFixed(2),
      most_expensive: mostExpensive
        ? {
            id: mostExpensive.id,
            name: mostExpensive.name,
            price: mostExpensive.price,
          }
        : null,
      cheapest: cheapest
        ? {
            id: cheapest.id,
            name: cheapest.name,
            price: cheapest.price,
          }
        : null,
    };
  }

  /**
   * Buscar produtos por faixa de preço
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .andWhere('product.is_active = :is_active', { is_active: true })
      .orderBy('product.price', 'ASC')
      .getMany();
  }

  /**
   * Buscar produtos por duração
   */
  async findByDuration(maxDuration: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        duration_minutes: LessThanOrEqual(maxDuration),
        is_active: true,
      },
      order: { duration_minutes: 'ASC' },
    });
  }

  /**
   * Criar múltiplos produtos (bulk)
   */
  async createMany(createDtos: CreateProductDto[]): Promise<Product[]> {
    const products = this.productRepository.create(createDtos);
    return await this.productRepository.save(products);
  }

  /**
   * Buscar produtos mais populares (mais agendados)
   */
  async findMostPopular(limit: number = 5): Promise<any[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.appointments', 'appointment')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.price', 'price')
      .addSelect('COUNT(appointment.id)', 'total_bookings')
      .where('appointment.status = :status', { status: 'completed' })
      .groupBy('product.id')
      .orderBy('total_bookings', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
