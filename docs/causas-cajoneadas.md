# Causas Cajoneadas — Especificación completa

## Origen de la idea

Feature propuesta para detectar y rankear causas judiciales que fueron iniciadas pero nunca avanzaron hacia una resolución. El objetivo es exponer patrones sistémicos: si un juez aparece sistemáticamente en el top del ranking, o si ciertos tipos de delitos se cajonean más que otros, el dato habla por sí solo sin que el observatorio emita opinión.

---

## Definición de "cajoneada"

> Una causa está **cajoneada** cuando fue iniciada (denuncia, apertura de instrucción) y no ha registrado movimiento hacia una resolución en un tiempo que supera el promedio histórico del sistema judicial argentino.

La definición es **puramente objetiva y temporal** — no requiere juicio editorial ni votación de usuarios. El dato es: fecha de inicio + ausencia de resolución + días transcurridos.

---

## Investigación estadística

### Metodología de búsqueda

Se realizaron tres búsquedas web el 19 de abril de 2026:

1. `CSJN estadísticas poder judicial Argentina duración promedio causas penales días resolución`
2. `Argentina estadísticas judiciales tiempo promedio resolución causas penales Ministerio Justicia`
3. `Argentina causas penales tiempo promedio sentencia días "plazo razonable" estadística primera instancia`

### Fuentes encontradas

| Fuente | Organismo | URL |
|---|---|---|
| Anuario Estadístico 2025 | CSJN | https://www.csjn.gov.ar/novedades/detalle/13002 |
| La duración del proceso penal en la República Argentina | Procuración General de la Nación (MPF) | https://www.mpf.gob.ar/docs/RepositorioB/Ebooks/qE533.pdf |
| Portal de Datos Abiertos de la Justicia Argentina | Ministerio de Justicia | https://datos.jus.gob.ar/dataset/poderes-judiciales-causas-penales |
| Sistema Nacional de Estadísticas Judiciales (SNEJ) | Argentina.gob.ar | https://www.argentina.gob.ar/justicia/politicacriminal/estadisticas/snej |
| El Plazo Razonable en el Proceso Penal | CSJN | https://sj.csjn.gov.ar/homeSJ/notas/nota/68/documento |
| Datos Argentina — Causas penales provinciales | datos.gob.ar | https://datos.gob.ar/dataset/justicia-poderes-judiciales---causas-penales |

### Datos clave encontrados

| Dato | Valor | Fuente |
|---|---|---|
| Promedio del proceso penal completo en Argentina | **41 meses (~1.250 días)** | Procuración General de la Nación |
| Mediana del proceso penal completo | **33 meses (~1.000 días)** | Procuración General de la Nación |
| Promedio de resolución en CSJN (última instancia) | **609 días** | Anuario Estadístico CSJN 2025 |
| Plazo máximo legal (CPPF) | Variable por etapa | Código Procesal Penal Federal |

> **Nota**: Los datos de la Procuración General corresponden al proceso penal completo (desde denuncia hasta sentencia firme). Los datos de la CSJN corresponden únicamente a la última instancia. No son comparables directamente.

---

## Umbrales definidos

Usando la **mediana de 33 meses como referencia del sistema completo** y siendo conservadores para primera instancia:

| Estado | Días desde inicio | Criterio |
|---|---|---|
| 🟢 **Activa** | < 365 días | Dentro del primer año. Normal en etapa de instrucción. |
| 🟡 **Demorada** | 365 – 730 días | Supera 1 año. Por debajo de la mediana nacional (~1.000 días). |
| 🔴 **Cajoneada** | > 730 días | Supera 2 años. Significativamente por encima para primera instancia. |

### Por qué 730 días y no 1.000 (la mediana)

La mediana de 1.000 días corresponde al proceso **completo** incluyendo juicio oral, apelaciones y eventual casación. Para una causa que lleva más de 2 años sin salir de la etapa de instrucción o sin llegar a juicio oral, ya es un indicador claro de estancamiento. Usar 1.000 días como umbral sería demasiado permisivo.

---

## Modelo de datos

### Cambios en `Caso`

```typescript
type EstadoCausa = 'activa' | 'demorada' | 'cajoneada' | 'resuelta';

// Nuevos campos en Caso:
fechaInicio: string           // ISO date — cuándo se abrió/denunció la causa
diasDesdeInicio: number       // calculado: today - fechaInicio
estadoCausa: EstadoCausa      // calculado según umbrales
```

### Lógica de cálculo

```typescript
function calcularEstadoCausa(fechaInicio: string, tieneResolucion: boolean): EstadoCausa {
  if (tieneResolucion) return 'resuelta';
  const dias = differenceInDays(new Date(), new Date(fechaInicio));
  if (dias < 365) return 'activa';
  if (dias < 730) return 'demorada';
  return 'cajoneada';
}
```

---

## Endpoints

### `GET /causas`

Ranking global de causas, ordenado por `diasDesdeInicio` DESC.

**Parámetros query:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `estado` | `activa\|demorada\|cajoneada\|resuelta\|todas` | Filtro por estado |
| `page` | number | Paginación |
| `limit` | number | Default 20 |

**Respuesta:** `PaginatedResult<CausaRanking>`

```typescript
interface CausaRanking {
  expediente: string;
  judgeSlug: string;
  judgeName: string;
  delito: string;
  fechaInicio: string;
  diasDesdeInicio: number;
  estadoCausa: EstadoCausa;
  tieneResolucion: boolean;
}
```

### `GET /judges/:slug/causas-ranking`

Mismo ranking pero filtrado al juez. Se muestra en el perfil del juez.

---

## Vistas (frontend)

### Vista 1 — `/causas` (Ranking global)

Página nueva con:
- Título + explicación breve del criterio
- Referencia a fuente estadística (Procuración General) con link
- Filtros: estado (activa / demorada / cajoneada / todas)
- Tabla: Juez · Expediente · Delito · Días · Estado badge
- Paginación

### Vista 2 — Sección en `/juez/:slug`

Sección "Causas por tiempo de demora" dentro del perfil existente:
- Misma tabla pero pre-filtrada al juez
- Sin filtro de juez (ya está en contexto)

### Página `/metodologia`

Página estática que documenta públicamente:
- Cómo se define "cajoneada"
- Los umbrales usados y por qué
- Las fuentes estadísticas con links directos
- Qué es dato duro vs. dato de contexto (distinción del Expediente Reputacional)

---

## Branches y PRs

| Branch | Repos | Contenido |
|---|---|---|
| `feat/causas-cajoneadas` | BE + FE | Modelo, endpoints, ranking global, sección en perfil de juez, página `/metodologia` |

---

## Roadmap relacionado

- **Fase siguiente**: cuando haya DB real, `fechaInicio` y `diasDesdeInicio` se calcularán dinámicamente desde datos reales del PJN
- **Filtros adicionales**: por fuero, por provincia, por tipo de delito
- **Alertas**: notificar cuando una causa activa pasa a demorada o cajoneada
