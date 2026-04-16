# Guía de contribución

Gracias por tu interés en contribuir al Observatorio Judicial Argentino. Este proyecto tiene un propósito de interés público: la transparencia del sistema judicial argentino. Cada contribución es bienvenida, siempre que respete las siguientes pautas.

---

## Código de conducta

Al participar en este proyecto aceptás nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

---

## Antes de empezar

1. **Abrí un issue primero.** Antes de escribir código, describí el problema o la propuesta en un issue para que podamos discutirla. Esto evita trabajo duplicado.
2. **Revisá los issues existentes.** Puede que alguien ya esté trabajando en lo mismo.
3. **Leé el README.** Entendé el stack, la arquitectura y los scripts disponibles.

---

## Flujo de trabajo

```
main (producción)
 └── develop (integración)
      └── feat/nombre-corto     ← tu rama de trabajo
      └── fix/nombre-del-bug
      └── docs/que-documentas
```

1. **Hacé fork** del repositorio.
2. Creá tu rama desde `develop` (nunca desde `main`):
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/mi-nueva-feature
   ```
3. Realizá tus cambios con commits pequeños y atómicos.
4. Pusheá tu rama y abrí un Pull Request contra `develop`.

---

## Convención de commits (obligatoria)

Este proyecto usa **Conventional Commits**. El hook `commit-msg` de Husky lo valida automáticamente.

### Formato

```
<tipo>(<alcance opcional>): <descripción corta en minúscula>

[cuerpo opcional]

[footer opcional: BREAKING CHANGE o refs a issues]
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|------|---------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `style` | Formato, espacios (sin cambio lógico) |
| `refactor` | Refactor sin feat ni fix |
| `perf` | Mejora de performance |
| `test` | Agregar o corregir tests |
| `chore` | Tareas de mantenimiento, deps |
| `ci` | Cambios en CI/CD |
| `revert` | Revertir un commit anterior |

### Ejemplos válidos

```bash
feat(auth): agregar endpoint de recuperación de contraseña
fix(judges): corregir cálculo de tasa de falla cuando total es cero
docs(readme): actualizar instrucciones de instalación
chore(deps): actualizar nestjs a v10.4
```

---

## Hooks de Husky

Al ejecutar `npm install`, Husky instala automáticamente tres hooks:

| Hook | Cuándo corre | Qué hace |
|------|-------------|----------|
| `pre-commit` | Antes de cada commit | `lint-staged`: Prettier + ESLint sobre archivos staged |
| `commit-msg` | Al escribir el mensaje | `commitlint`: valida el formato Conventional Commits |
| `pre-push` | Antes de cada push | `typecheck` + `build`: el código debe compilar sin errores |

**Si algún hook falla, el commit o push es bloqueado.**

---

## Estilo de código

- **TypeScript estricto**: no uses `any` (genera warning).
- **NestJS conventions**: un módulo por dominio, inyección de dependencias, decoradores de NestJS.
- No expongas datos sensibles (passwordHash, tokens) en las respuestas HTTP.
- Validá siempre los inputs en los controllers antes de pasarlos al service.

---

## Pull Requests

- Apuntá siempre a la rama `develop`, nunca a `main`.
- Completá **todos los campos** del template de PR.
- Un PR debe hacer **una sola cosa**.
- El CI debe estar en verde (lint + typecheck + build).
- Si cambia el contrato de la API, actualizá la tabla de endpoints en el README.

---

## Dudas

Si tenés preguntas sobre el proyecto, abrí un issue con el label `question`.
