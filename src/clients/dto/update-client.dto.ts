import { IsBoolean, IsOptional } from 'class-validator';
import { CreateClientDto } from './create-client.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
