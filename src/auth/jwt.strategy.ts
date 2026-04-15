import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export const JWT_SECRET = process.env.JWT_SECRET || 'OJA_DEV_SECRET_CHANGE_IN_PRODUCTION';

export interface JwtPayload {
  sub: string;
  email: string;
  nombre: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Cookie HTTP-only (método principal)
        (req: Request) => req?.cookies?.oja_token ?? null,
        // 2. Header Authorization: Bearer <token> (fallback para APIs)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email, nombre: payload.nombre };
  }
}
