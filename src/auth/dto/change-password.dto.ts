// src/auth/dto/change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  current_password: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  new_password: string;
}
