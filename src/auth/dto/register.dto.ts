// src/auth/dto/register.dto.ts
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('BR')
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}
