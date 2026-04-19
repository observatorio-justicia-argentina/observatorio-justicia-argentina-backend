# Expediente Reputacional — Diseño completo

> **Este documento cubre las 4 fases del Expediente Reputacional.**
> La Fase 1 está implementada en este PR. Las fases 2, 3 y 4 se implementarán en PRs separados.

## Contexto

El Expediente Reputacional enriquece el perfil de cada magistrado con tres capas de datos más allá de las métricas de libertades cautelares:

| Capa | Descripción | Fases |
|---|---|---|
| A — Trayectoria y designación | Origen político, concurso en la Magistratura, aval del Senado | Fase 1 |
| B — Vínculos institucionales | Asociaciones judiciales, agrupaciones, afiliaciones | Fase 1 |
| C — Impacto público | Cobertura mediática, noticias, análisis con IA | Fases 2 y 3 |
| D — Timeline integrado | Vista unificada de carrera + noticias + decisiones notables | Fase 4 |

---

## Fase 1 — Trayectoria y vínculos (este PR)

### Nuevas interfaces

#### `JudgeAssociation`

```typescript
interface JudgeAssociation {
  name: string;       // "Justicia Legítima"
  role?: string;      // "Miembro activo"
  since?: number;     // 2012
  sourceUrl?: string; // URL a fuente pública
}
```

#### `PoliticalOrigin`

```typescript
type PoliticalOrigin = 'judicial' | 'political' | 'academic' | 'mixed';
```

| Valor | Significado |
|---|---|
| `judicial` | Carrera judicial pura (empleado → secretario → juez) |
| `political` | Nombramiento con fuerte respaldo político sin carrera previa |
| `academic` | Origen en la docencia/academia con concurso posterior |
| `mixed` | Trayectoria mixta (carrera + aval político explícito) |

#### `JudgeAppointmentDetail`

```typescript
interface JudgeAppointmentDetail {
  politicalOrigin: PoliticalOrigin;
  politicalOriginDetail?: string;       // descripción libre del contexto
  magistraturaScore?: number;           // puntaje en el concurso
  magistraturaRank?: number;            // puesto en el orden de mérito
  magistraturaCompetitionId?: string;   // ej: "Concurso N° 312"
  magistraturaSourceUrl?: string;       // link al acta del concurso
  senateBackers?: string[];             // senadores que avalaron el pliego
  senateSession?: string;               // fecha de la sesión del Senado
  senateRecordUrl?: string;             // link a versión taquigráfica
}
```

### Campos nuevos en `Judge`

```typescript
associations?: JudgeAssociation[];
appointmentDetail?: JudgeAppointmentDetail;
```

Ambos campos son opcionales — su ausencia no afecta el resto del perfil.

### Datos mock (demo)

| Juez | `politicalOrigin` | Asociaciones |
|---|---|---|
| Juan Carlos Pérez Gómez (CABA) | `judicial` | Asociación de Magistrados de la Nación |
| María Elena Gutiérrez Sosa (Bs. As.) | `mixed` | Justicia Legítima + AMPBA |
| Roberto Ernesto Molina Paz (Córdoba) | `political` | — |

> Todos los datos son ficticios y están marcados con `(FICTICIO)`.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/judges/judges.interface.ts` | Nuevas interfaces y campos en `Judge` |
| `src/judges/judges.service.ts` | Datos mock en 3 jueces demo |

---

## Fase 2 — Pipeline de noticias (PR futuro)

### Objetivo

Agregar cobertura mediática de cada magistrado: noticias de medios nacionales obtenidas via scraping, almacenadas y expuestas vía API.

### Diseño técnico

```
CronJob (diario)
  └─ SerpAPI / NewsAPI → filtra por nombre del juez
       └─ Normaliza y deduplica
            └─ Persiste en store (JSON / DB)
                 └─ GET /judges/:slug/noticias
```

### Nueva interfaz

```typescript
interface JudgeNoticia {
  title: string;
  source: string;        // "Infobae", "La Nación", "Clarín"
  url: string;
  publishedAt: string;   // ISO date
  snippet?: string;      // extracto del artículo
  sentiment?: 'positive' | 'negative' | 'neutral'; // Fase 3
}
```

### Nuevo endpoint

```
GET /judges/:slug/noticias?page=1&limit=10
→ PaginatedResult<JudgeNoticia>
```

### Archivos a crear/modificar

| Archivo | Cambio |
|---|---|
| `src/noticias/noticias.module.ts` | Nuevo módulo |
| `src/noticias/noticias.service.ts` | Lógica de scraping + normalización |
| `src/noticias/noticias.controller.ts` | Endpoint GET /judges/:slug/noticias |
| `src/judges/judges.interface.ts` | Agregar `JudgeNoticia` |

---

## Fase 3 — Capa de IA (PR futuro)

### Objetivo

Analizar la cobertura mediática acumulada de cada magistrado con la Claude API para generar:
- Resumen narrativo de su imagen pública
- Tags automáticos de temas recurrentes (`corrupción`, `derechos humanos`, `garantismo`, etc.)
- Score de sentimiento agregado

### Diseño técnico

```
GET /judges/:slug/analisis-mediatico
  └─ Toma últimas N noticias del juez
       └─ Prompt a Claude API (claude-3-5-haiku)
            └─ Devuelve resumen + tags + sentiment score
```

### Nueva interfaz

```typescript
interface JudgeAnalisisMediatico {
  resumen: string;           // párrafo generado por IA
  tags: string[];            // ["garantismo", "corrupción policial"]
  sentimentScore: number;    // -1 (muy negativo) a +1 (muy positivo)
  noticiasAnalizadas: number;
  generatedAt: string;       // ISO date
  model: string;             // "claude-haiku-3-5"
}
```

### Nuevo endpoint

```
GET /judges/:slug/analisis-mediatico
→ JudgeAnalisisMediatico | null
```

### Consideraciones

- Cachear el resultado por 24hs para no recomputar en cada request
- Marcar claramente en el frontend que el resumen es generado por IA
- Incluir disclaimer: "Este análisis es automatizado y puede contener errores"

---

## Fase 4 — Timeline integrado (PR futuro)

### Objetivo

Vista cronológica unificada que combina en un solo eje temporal:
- Hitos de la carrera (`careerHistory`)
- Noticias relevantes (Fase 2)
- Decisiones notables (`notableDecisions`)
- Cambios en `appointmentDetail` (si aplica)

### Diseño técnico

```
GET /judges/:slug/timeline
  └─ Fusiona careerHistory + noticias + notableDecisions
       └─ Ordena cronológicamente
            └─ Devuelve array de TimelineEvent tipado
```

### Nueva interfaz

```typescript
type TimelineEventType = 'career' | 'noticia' | 'decision' | 'appointment';

interface TimelineEvent {
  type: TimelineEventType;
  date: string;          // ISO date
  title: string;
  description?: string;
  sourceUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}
```

### Nuevo endpoint

```
GET /judges/:slug/timeline
→ TimelineEvent[]
```

### Frontend

Componente visual de timeline vertical con íconos por tipo de evento, colores por sentiment y filtro por `type`.
