// src/auth/dto/change-password.dto.ts
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  new_password: string;
}
