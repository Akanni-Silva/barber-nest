// src/auth/dto/reset-password.dto.ts
// Criar este arquivo
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  new_password: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;
}
