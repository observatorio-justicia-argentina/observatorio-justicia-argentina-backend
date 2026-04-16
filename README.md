# Observatorio Judicial Argentino — Backend

[![CI](https://github.com/tu-org/observatorio-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/tu-org/observatorio-backend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

API REST del Observatorio Judicial Argentino. Expone datos de jueces con agregación jerárquica por jurisdicción y gestiona la autenticación con JWT via cookies HTTP-only.

> **Nota:** actualmente usa almacenamiento en memoria. Los datos se pierden al reiniciar el proceso. La integración con base de datos (PostgreSQL) está pendiente.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | NestJS 10 |
| Lenguaje | TypeScript 5 |
| Auth | JWT + Passport + cookies HTTP-only |
| Hashing | bcryptjs |
| Storage | En memoria (sin DB por ahora) |
| Calidad | ESLint · Prettier · Husky · commitlint |

---

## Requisitos previos

- Node.js ≥ 20

---

## Instalación y desarrollo

```bash
# 1. Clonar
git clone https://github.com/tu-org/observatorio-backend.git
cd observatorio-backend

# 2. Instalar dependencias (también instala los hooks de Husky)
npm install

# 3. Levantar el servidor de desarrollo (hot-reload)
npm run start:dev
# → http://localhost:3600
```

---

## Endpoints

### Jueces
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/judges` | No | Lista todos los jueces con stats |
| GET | `/api/judges/:id` | No | Un juez por ID |
| GET | `/api/stats/hierarchy` | No | Árbol Argentina → Provincia → Depto. Judicial |
| GET | `/api/stats/provinces` | No | Stats agrupadas por provincia |

### Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Crear cuenta |
| POST | `/api/auth/login` | No | Iniciar sesión (setea cookie) |
| GET | `/api/auth/me` | JWT | Usuario actual |
| POST | `/api/auth/logout` | No | Cerrar sesión (borra cookie) |

### Contactos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/contacts` | JWT | Lista todos los contactos registrados |

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Servidor con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm run start:prod` | Producción (requiere build previo) |
| `npm run lint` | Verificar ESLint |
| `npm run lint:fix` | Corregir ESLint automáticamente |
| `npm run format` | Formatear con Prettier |
| `npm run typecheck` | Verificar tipos TypeScript |

---

## Estructura del proyecto

```
src/
├── auth/
│   ├── auth.controller.ts     # POST register/login, GET me, POST logout
│   ├── auth.service.ts        # Lógica de autenticación y JWT
│   ├── auth.module.ts
│   ├── jwt.strategy.ts        # Extrae JWT desde cookie o header
│   └── jwt-auth.guard.ts      # Guard para rutas protegidas
├── contacts/
│   ├── contacts.controller.ts # GET /contacts (protegido)
│   ├── contacts.service.ts    # Store en memoria, hashing de passwords
│   ├── contacts.interface.ts
│   └── contacts.module.ts
├── judges/
│   ├── judges.controller.ts
│   ├── judges.service.ts      # Datos mock hardcodeados
│   ├── judges.interface.ts
│   └── judges.module.ts
├── stats/
│   ├── stats.controller.ts
│   ├── stats.service.ts       # Agregación jerárquica
│   ├── stats.interface.ts
│   └── stats.module.ts
├── app.module.ts
└── main.ts
```

---

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `JWT_SECRET` | `OJA_DEV_SECRET_CHANGE_IN_PRODUCTION` | Clave secreta JWT — **cambiar en producción** |
| `NODE_ENV` | `development` | Afecta `Secure` flag de la cookie |
| `PORT` | `3600` | Puerto del servidor (pendiente de implementar) |

---

## Cómo contribuir

Leé [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un PR. Los hooks de Husky verifican lint, formato y tipos antes de cada commit y push.

---

## Licencia

[MIT](LICENSE) — Observatorio Judicial Argentino
