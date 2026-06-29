// src/auth/controllers/auth.controller.ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/auth/controllers/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { BarberGuard } from '../guard/barber.guard';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PublicProfileDto } from '../dto/public-profile.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@ApiTags('Autenticacao')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar barbeiro' })
  @ApiResponse({ status: 201, description: 'Barbeiro registrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Cadastro não permitido' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar barbeiro' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @ApiOperation({ summary: 'Buscar perfil do barbeiro' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user.id);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard, BarberGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterar senha do barbeiro' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil do barbeiro' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Barbeiro não encontrado' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('public-profile')
  @ApiOperation({
    summary: '🔓 Buscar informações públicas da barbearia',
    description:
      'Retorna apenas dados públicos como nome, endereço, telefone e redes sociais. NUNCA retorna email, id ou dados sensíveis.',
  })
  @ApiOkResponse({
    description: 'Informações encontradas com sucesso',
    type: PublicProfileDto,
  })
  @ApiNotFoundResponse({
    description: 'Barbearia não encontrada ou inativa',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno ao buscar informações',
  })
  async getPublicProfile(): Promise<PublicProfileDto> {
    return await this.authService.getPublicProfile();
  }

  /**
   * ✅ Solicitar recuperação de senha
   * 🔒 NUNCA retorna a senha do usuário
   * 📧 Envia um email com link de redefinição
   * 🔓 Endpoint público - não requer autenticação
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '🔓 Solicitar recuperação de senha',
    description:
      'Envia um email com link para redefinir a senha. NUNCA retorna a senha do usuário.',
  })
  @ApiOkResponse({
    description: 'Solicitação processada com sucesso',
    schema: {
      example: {
        message: 'Se o email existir, um link de recuperação será enviado.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email inválido',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * ✅ Redefinir senha com token
   * 🔒 NUNCA retorna a senha do usuário
   * 🔑 Token é obrigatório e tem expiração
   * 🔓 Endpoint público - não requer autenticação
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '🔓 Redefinir senha com token',
    description:
      'Redefine a senha usando um token válido. NUNCA retorna a senha do usuário.',
  })
  @ApiOkResponse({
    description: 'Senha redefinida com sucesso',
    schema: {
      example: {
        message: 'Senha redefinida com sucesso!',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token inválido, expirado ou senhas não coincidem',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
