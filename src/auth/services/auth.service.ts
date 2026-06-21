// src/auth/services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from '../entities/barber.entity';
import { Bcrypt } from '../bcrypt/bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';

type PublicBarber = Omit<Barber, 'password_hash'>;

function removePasswordHash(barber: Barber): PublicBarber {
  const result = { ...barber };
  delete (result as Partial<Barber>).password_hash;
  return result;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Barber)
    private barberRepository: Repository<Barber>,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  /**
   * ✅ Verificar se já existe um barbeiro registrado
   */
  async canRegister(): Promise<{ canRegister: boolean; message?: string }> {
    const barberCount = await this.barberRepository.count();

    if (barberCount > 0) {
      return {
        canRegister: false,
        message:
          'Já existe um barbeiro registrado. Faça login para acessar o sistema.',
      };
    }

    return {
      canRegister: true,
      message: 'Nenhum barbeiro registrado. Crie sua conta agora.',
    };
  }

  /**
   * ✅ Registrar o primeiro e ÚNICO barbeiro
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; barber: PublicBarber }> {
    // 🔒 Verificar se já existe barbeiro
    const canRegister = await this.canRegister();

    if (!canRegister.canRegister) {
      throw new ForbiddenException(canRegister.message);
    }

    const existingBarber = await this.barberRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingBarber) {
      throw new ConflictException('Email já está em uso');
    }

    const passwordHash = await this.bcrypt.hashPassword(registerDto.password);

    const barber = this.barberRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password_hash: passwordHash,
      phone: registerDto.phone,
      avatar_url: registerDto.avatar_url || undefined,
      is_active: true,
    });

    const savedBarber = await this.barberRepository.save(barber);

    return {
      message:
        '✅ Barbeiro registrado com sucesso! Agora você pode fazer login.',
      barber: removePasswordHash(savedBarber),
    };
  }

  async validateUser(email: string, password: string): Promise<PublicBarber> {
    const barber = await this.barberRepository.findOne({
      where: { email },
    });

    if (!barber) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!barber.is_active) {
      throw new UnauthorizedException('Conta desativada');
    }

    const matchPassword = await this.bcrypt.comparePassword(
      password,
      barber.password_hash,
    );

    if (!matchPassword) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return removePasswordHash(barber);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    await this.barberRepository.update(
      { id: user.id },
      { last_login_at: new Date() },
    );

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar_url: user.avatar_url,
      token: `Bearer ${token}`,
    };
  }

  async changePassword(
    barberId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const barber = await this.barberRepository.findOne({
      where: { id: barberId },
    });

    if (!barber) {
      throw new NotFoundException('Barbeiro não encontrado');
    }

    const isPasswordValid = await this.bcrypt.comparePassword(
      changePasswordDto.current_password,
      barber.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    barber.password_hash = await this.bcrypt.hashPassword(
      changePasswordDto.new_password,
    );
    await this.barberRepository.save(barber);

    return { message: 'Senha alterada com sucesso' };
  }

  async getProfile(barberId: number): Promise<PublicBarber> {
    const barber = await this.barberRepository.findOne({
      where: { id: barberId },
    });

    if (!barber) {
      throw new NotFoundException('Barbeiro não encontrado');
    }

    return removePasswordHash(barber);
  }

  async findById(id: number): Promise<Barber | null> {
    return await this.barberRepository.findOne({
      where: { id, is_active: true },
    });
  }

  async findByEmail(email: string): Promise<Barber | null> {
    return await this.barberRepository.findOne({
      where: { email },
    });
  }
}
