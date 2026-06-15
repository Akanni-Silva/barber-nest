import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsString()
  preferences?: string;
}
