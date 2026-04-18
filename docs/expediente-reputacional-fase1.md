# Expediente Reputacional — Fase 1

## Contexto

Feature diseñada para enriquecer el perfil de cada juez/fiscal con tres capas de datos más allá de las métricas de libertades:

| Capa | Descripción | Estado |
|---|---|---|
| A — Trayectoria | Origen, concurso, carrera | ✅ Fase 1 |
| B — Vínculos | Asociaciones, padrinos políticos | ✅ Fase 1 |
| C — Impacto público | Scraping de noticias + IA | 🔲 Fase 2/3 |

## Nuevas interfaces

### `JudgeAssociation`

```typescript
interface JudgeAssociation {
  name: string;       // "Justicia Legítima"
  role?: string;      // "Miembro activo"
  since?: number;     // 2012
  sourceUrl?: string; // URL a fuente pública
}
```

### `PoliticalOrigin`

```typescript
type PoliticalOrigin = 'judicial' | 'political' | 'academic' | 'mixed';
```

| Valor | Significado |
|---|---|
| `judicial` | Carrera judicial pura (empleado → secretario → juez) |
| `political` | Nombramiento con fuerte respaldo político sin carrera previa |
| `academic` | Origen en la docencia/academia con concurso posterior |
| `mixed` | Trayectoria mixta (carrera + aval político explícito) |

### `JudgeAppointmentDetail`

```typescript
interface JudgeAppointmentDetail {
  politicalOrigin: PoliticalOrigin;
  politicalOriginDetail?: string;       // descripción libre del contexto
  magistraturaScore?: number;           // puntaje en el concurso
  magistraturaRank?: number;            // puesto en el orden de mérito
  magistraturaCompetitionId?: string;   // ej: "Concurso N° 312"
  magistraturaSourceUrl?: string;       // link al acta del concurso
  senateBackers?: string[];             // senadores que avalaron el pliego
  senateSession?: string;               // fecha de la sesión
  senateRecordUrl?: string;             // link a versión taquigráfica
}
```

## Cambios en `Judge`

```typescript
// Nuevos campos opcionales en la interfaz principal
associations?: JudgeAssociation[];
appointmentDetail?: JudgeAppointmentDetail;
```

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/judges/judges.interface.ts` | Nuevas interfaces y campos en `Judge` |
| `src/judges/judges.service.ts` | Datos mock para los 3 jueces demo |

## Datos mock (demo)

| Juez | `politicalOrigin` | Asociaciones |
|---|---|---|
| Juan Carlos Pérez Gómez (CABA) | `judicial` | Asociación de Magistrados de la Nación |
| María Elena Gutiérrez Sosa (Bs. As.) | `mixed` | Justicia Legítima + AMPBA |
| Roberto Ernesto Molina Paz (Córdoba) | `political` | — |

> Todos los datos son ficticios. Los nombres, puntajes, senadores y URLs están marcados con `(FICTICIO)`.

## Próximas fases

- **Fase 2**: Pipeline de noticias — job cron con SerpAPI, endpoint `GET /judges/:slug/noticias`
- **Fase 3**: Capa de IA — resumen de cobertura mediática y tags automáticos con Claude API
- **Fase 4**: Timeline visual combinando `careerHistory` + noticias + `notableDecisions`
