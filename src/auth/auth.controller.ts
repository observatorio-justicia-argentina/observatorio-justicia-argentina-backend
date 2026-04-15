import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

const COOKIE_NAME = 'oja_token';
const COOKIE_OPTIONS = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge,
  path: '/',
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /api/auth/register */
  @Post('register')
  async register(
    @Body() body: {
      nombre?: string;
      email?: string;
      dni?: string;
      telefono?: string;
      rol?: string;
      password?: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { nombre, email, dni, telefono, rol, password } = body;
    if (!nombre || !email || !dni || !telefono || !rol || !password) {
      throw new BadRequestException('Todos los campos son obligatorios');
    }

    const result = await this.authService.register({ nombre, email, dni, telefono, rol, password });

    res.cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS(result.cookieMaxAge));
    return { user: result.user, token: result.token };
  }

  /** POST /api/auth/login */
  @Post('login')
  async login(
    @Body() body: { email?: string; password?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email y contraseña son obligatorios');
    }

    const result = await this.authService.login(body.email, body.password);

    res.cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS(result.cookieMaxAge));
    return { user: result.user, token: result.token };
  }

  /** GET /api/auth/me — requiere JWT */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request & { user: any }) {
    return req.user;
  }

  /** POST /api/auth/logout */
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { message: 'Sesión cerrada correctamente' };
  }
}
