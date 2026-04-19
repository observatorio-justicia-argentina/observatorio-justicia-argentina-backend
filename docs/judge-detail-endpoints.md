# Endpoints de Detalle de Juez

## Contexto

Reemplaza el esquema original de rutas con ID numérico (`/judges/1`) por slugs semánticos (`/judges/juan-carlos-perez-gomez-caba`) para mejorar SEO, compartibilidad y eliminar enumeración de IDs.

## Endpoints

### `GET /judges`

Devuelve el listado completo de jueces con estadísticas calculadas.

**Respuesta:** `JudgeWithStats[]`

```json
[
  {
    "id": 1,
    "slug": "juan-carlos-perez-gomez-caba",
    "name": "Dr. Juan Carlos Pérez Gómez",
    "totalFailures": 189,
    "failureRate": 38.5,
    ...
  }
]
```

---

### `GET /judges/:slug`

Perfil completo de un juez por su slug semántico.

**Ejemplo:** `GET /judges/juan-carlos-perez-gomez-caba`

**Respuesta:** `JudgeWithStats`

**Errores:**
- `404` si el slug no existe

---

### `GET /judges/:slug/casos`

Casos del juez paginados.

**Parámetros query:**
| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | number | 1 | Página actual |
| `limit` | number | 10 | Registros por página |

**Ejemplo:** `GET /judges/juan-carlos-perez-gomez-caba/casos?page=2&limit=10`

**Respuesta:** `PaginatedResult<Caso>`

```json
{
  "data": [...],
  "total": 47,
  "page": 2,
  "limit": 10,
  "totalPages": 5
}
```

**Errores:**
- `404` si el slug no existe

---

### `GET /judges/:slug/archivos`

Documentos públicos asociados al juez.

**Ejemplo:** `GET /judges/juan-carlos-perez-gomez-caba/archivos`

**Respuesta:** `ArchivoPublico[]`

**Errores:**
- `404` si el slug no existe

---

## Generación de slugs

La utilidad `generateSlug(name, province)` en `judges.service.ts`:

```typescript
generateSlug("Dr. Juan Carlos Pérez Gómez", "CABA")
// → "juan-carlos-perez-gomez-caba"
```

Pasos de normalización:
1. Eliminar diacríticos (NFD + strip combining marks)
2. Quitar tratamiento `Dr.` / `Dra.`
3. Lowercase
4. Eliminar caracteres no alfanuméricos (excepto espacios)
5. Reemplazar espacios por guiones
6. Concatenar nombre + provincia

El campo `slug` se almacena en el modelo de datos del juez para evitar recalculo en cada request.

---

## Interfaces clave

```typescript
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Caso {
  id: string;
  judgeId: number;
  nroExpediente: string;
  fechaResolucion: string; // YYYY-MM-DD
  tipoMedida: string;
  resultado: 'fta' | 'nuevo_arresto' | 'revocada' | 'pendiente';
  observaciones?: string;
}

interface ArchivoPublico {
  id: string;
  judgeId: number;
  nombre: string;
  url: string;
  fechaCarga: string; // YYYY-MM-DD
}
```

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/judges/judges.interface.ts` | `PaginatedResult<T>`, `Caso`, `ArchivoPublico`, campo `slug` en `Judge` |
| `src/judges/judges.service.ts` | `generateSlug()`, `findBySlug()`, `getCasosByJudge()`, `getArchivosByJudge()` |
| `src/judges/judges.controller.ts` | Rutas `/:slug`, `/:slug/casos`, `/:slug/archivos` |

---

## Decisiones de diseño

- **¿Por qué slug y no ID?** SEO (Google indexa el nombre del juez en la URL), compartibilidad, y elimina la posibilidad de enumerar perfiles por ID numérico.
- **¿Por qué los sub-recursos usan slug también?** Consistencia total de la API pública. Internamente el service resuelve el slug al ID antes de consultar casos/archivos.
- **¿Por qué mantener `id` en el modelo?** Es la clave primaria interna para joins futuros con base de datos real. No se expone en URLs públicas.
