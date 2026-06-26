// src/auth/dto/update-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  // ✅ Campos de endereço
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  address_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  neighborhood?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(8, 10)
  zip_code?: string;

  // ✅ Horário de funcionamento
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  working_hours?: string;

  // ✅ Redes sociais e contato
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  whatsapp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  instagram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(5, 100)
  facebook?: string;

  // ✅ Link do Google Maps
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  google_maps_url?: string;
}
