import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookies
  app.use(cookieParser());

  // CORS — permite credenciales (cookies) desde el frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(3600);
  console.log('✅ Observatorio Backend corriendo en http://localhost:3600');
  console.log('');
  console.log('   Jueces:');
  console.log('   GET  /api/judges');
  console.log('   GET  /api/stats/hierarchy');
  console.log('');
  console.log('   Auth:');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/auth/me');
  console.log('   POST /api/auth/logout');
  console.log('');
  console.log('   Contactos (requiere JWT):');
  console.log('   GET  /api/contacts');
}

bootstrap();
