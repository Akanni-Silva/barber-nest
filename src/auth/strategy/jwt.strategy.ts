// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/constants';
import { AuthService } from '../services/auth.service';

interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<{
    id: number;
    email: string;
    name: string;
  }> {
    const barber = await this.authService.findById(payload.sub);

    if (!barber) {
      throw new UnauthorizedException('Barbeiro não encontrado ou inativo');
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
