// src/auth/dto/public-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para resposta pública da barbearia
 * ⚠️ NÃO contém dados sensíveis como email, id, etc.
 */
export class PublicProfileDto {
  @ApiProperty({ description: 'Nome da barbearia/barbeiro' })
  name: string;

  @ApiProperty({ description: 'Telefone para contato' })
  phone: string;

  @ApiProperty({ required: false, description: 'URL do avatar' })
  avatar_url?: string | null;

  @ApiProperty({ required: false, description: 'Endereço (rua)' })
  address?: string | null;

  @ApiProperty({ required: false, description: 'Número do endereço' })
  address_number?: string | null;

  @ApiProperty({ required: false, description: 'Bairro' })
  neighborhood?: string | null;

  @ApiProperty({ required: false, description: 'Cidade' })
  city?: string | null;

  @ApiProperty({ required: false, description: 'Estado (UF)' })
  state?: string | null;

  @ApiProperty({ required: false, description: 'CEP' })
  zip_code?: string | null;

  @ApiProperty({ required: false, description: 'Horário de funcionamento' })
  working_hours?: string | null;

  @ApiProperty({ required: false, description: 'WhatsApp para contato' })
  whatsapp?: string | null;

  @ApiProperty({ required: false, description: 'Instagram' })
  instagram?: string | null;

  @ApiProperty({ required: false, description: 'Facebook' })
  facebook?: string | null;

  @ApiProperty({ required: false, description: 'Link do Google Maps' })
  google_maps_url?: string | null;

  @ApiProperty({ description: 'Indica se a barbearia está ativa' })
  is_active: boolean;

  @ApiProperty({ description: 'Data de criação do perfil' })
  created_at: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updated_at: Date;
}
