import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Barber } from '../entities/barber.entity';
import { AuthService } from '../services/auth.service';

type PublicBarber = Omit<Barber, 'password_hash'>;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<PublicBarber> {
    const barber = await this.authService.validateUser(email, password);

    if (!barber) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    return barber;
  }
}
