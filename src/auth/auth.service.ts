import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContactsService } from '../contacts/contacts.service';
import { ContactPublic } from '../contacts/contacts.interface';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días en ms

export interface AuthResult {
  user: ContactPublic;
  token: string;
  cookieMaxAge: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: {
    nombre: string;
    email: string;
    dni: string;
    telefono: string;
    rol: string;
    password: string;
  }): Promise<AuthResult> {
    const user = await this.contactsService.create(data);
    return { user, token: this.sign(user), cookieMaxAge: COOKIE_MAX_AGE };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const contact = await this.contactsService.validatePassword(email, password);
    if (!contact) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...user } = contact;
    return { user, token: this.sign(user), cookieMaxAge: COOKIE_MAX_AGE };
  }

  private sign(user: ContactPublic): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      nombre: user.nombre,
    });
  }
}
