import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactPublic } from '../contacts/contacts.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<Tuser = ContactPublic>(err: Error | null, user: Tuser | false): Tuser {
    if (err || !user) {
      throw (
        err ?? new UnauthorizedException('Sesión inválida o expirada. Iniciá sesión nuevamente.')
      );
    }
    return user;
  }
}
