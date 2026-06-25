// backend/src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  duration_minutes: number;

  @ApiProperty({ enum: ProductCategory, default: ProductCategory.OTHER })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;
}
