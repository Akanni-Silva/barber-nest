// src/auth/services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from '../entities/barber.entity';
import { Bcrypt } from '../bcrypt/bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PublicProfileDto } from '../dto/public-profile.dto';

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
      whatsapp: registerDto.phone, // ✅ Inicialmente, o WhatsApp é o mesmo que o telefone
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

  /**
   * ✅ Atualizar perfil do barbeiro
   */
  async updateProfile(
    barberId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string; barber: PublicBarber }> {
    const barber = await this.barberRepository.findOne({
      where: { id: barberId },
    });

    if (!barber) {
      throw new NotFoundException('Barbeiro não encontrado');
    }

    // ✅ Verificar se o email já está em uso por outro barbeiro
    if (updateProfileDto.email) {
      const existingBarber = await this.barberRepository.findOne({
        where: { email: updateProfileDto.email },
      });

      if (existingBarber && existingBarber.id !== barberId) {
        throw new ConflictException('Email já está em uso por outro barbeiro');
      }
    }

    if (updateProfileDto.name) {
      barber.name = updateProfileDto.name;
    }

    if (updateProfileDto.email) {
      barber.email = updateProfileDto.email;
    }

    if (updateProfileDto.phone) {
      barber.phone = updateProfileDto.phone;
    }

    if (updateProfileDto.avatar_url !== undefined) {
      barber.avatar_url = updateProfileDto.avatar_url;
    }

    // ✅ Atualizar campos de endereço
    if (updateProfileDto.address !== undefined) {
      barber.address = updateProfileDto.address;
    }

    if (updateProfileDto.address_number !== undefined) {
      barber.address_number = updateProfileDto.address_number;
    }

    if (updateProfileDto.neighborhood !== undefined) {
      barber.neighborhood = updateProfileDto.neighborhood;
    }

    if (updateProfileDto.city !== undefined) {
      barber.city = updateProfileDto.city;
    }

    if (updateProfileDto.state !== undefined) {
      barber.state = updateProfileDto.state;
    }

    if (updateProfileDto.zip_code !== undefined) {
      barber.zip_code = updateProfileDto.zip_code;
    }

    if (updateProfileDto.working_hours !== undefined) {
      barber.working_hours = updateProfileDto.working_hours;
    }

    if (updateProfileDto.whatsapp !== undefined) {
      barber.whatsapp = updateProfileDto.whatsapp;
    }

    if (updateProfileDto.instagram !== undefined) {
      barber.instagram = updateProfileDto.instagram;
    }

    if (updateProfileDto.facebook !== undefined) {
      barber.facebook = updateProfileDto.facebook;
    }

    if (updateProfileDto.google_maps_url !== undefined) {
      barber.google_maps_url = updateProfileDto.google_maps_url;
    }

    const updatedBarber = await this.barberRepository.save(barber);

    return {
      message: 'Perfil atualizado com sucesso',
      barber: removePasswordHash(updatedBarber),
    };
  }

  /**
   * ✅ Buscar dados públicos do barbeiro
   */
  async getPublicProfile(): Promise<PublicProfileDto> {
    try {
      const barber = await this.barberRepository.findOne({
        where: { is_active: true },
        // ✅ Usando a sintaxe correta do TypeORM para select
        select: {
          name: true,
          phone: true,
          avatar_url: true,
          address: true,
          address_number: true,
          neighborhood: true,
          city: true,
          state: true,
          zip_code: true,
          working_hours: true,
          whatsapp: true,
          instagram: true,
          facebook: true,
          google_maps_url: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!barber) {
        throw new NotFoundException('Barbearia não encontrada ou inativa');
      }

      // ✅ Retorna apenas os campos selecionados
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      return barber as PublicProfileDto;
    } catch (error) {
      // ✅ Se for uma exceção já conhecida, relançar
      if (error instanceof NotFoundException) {
        throw error;
      }

      // ✅ Erro inesperado - lançar InternalServerErrorException
      throw new InternalServerErrorException(
        'Erro ao buscar informações da barbearia. Tente novamente mais tarde.',
      );
    }
  }
}
