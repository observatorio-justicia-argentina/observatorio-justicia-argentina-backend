import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const isProd = process.env.NODE_ENV === 'production';

// Orígenes permitidos: localhost en dev + URL de Vercel en prod
// Podés agregar más orígenes en FRONTEND_URLS separados por coma
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://observatorio-justicia-argentina-fro.vercel.app',
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',').map((u) => u.trim()) : []),
].filter(Boolean);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requests sin origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Render asigna el puerto via PORT; localmente usamos 3600
  const port = process.env.PORT ?? 3600;
  await app.listen(port);

  const host = isProd
    ? `https://observatorio-justicia-argentina-backend.onrender.com`
    : `http://localhost:${port}`;

  console.log(`✅ Backend corriendo en ${host}`);
  console.log(`   Entorno: ${isProd ? 'producción' : 'desarrollo'}`);
  console.log(`   Orígenes permitidos: ${ALLOWED_ORIGINS.join(', ')}`);
}

bootstrap();
