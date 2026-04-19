# Principios editoriales del Observatorio

## El principio central

> **El Observatorio no acusa. Publica información pública trabajada y cruda para que periodistas, abogados y ciudadanos puedan acceder, analizar y sacar sus propias conclusiones.**

Este principio rige todas las decisiones de diseño, implementación y presentación de datos del sistema.

## Lo que hacemos

- Recopilamos y estructuramos información pública sobre magistrados del Poder Judicial
- Calculamos métricas objetivas (tasas, días, rankings) sobre esa información
- Exponemos las fuentes de cada dato para que cualquiera pueda verificarlo
- Documentamos nuestra metodología con lujo de detalle (ver `causas-cajoneadas.md`)
- Damos herramientas de filtrado para que cada usuario construya su propio análisis

## Lo que no hacemos

- No emitimos juicios editoriales sobre magistrados
- No calificamos decisiones judiciales como "correctas" o "incorrectas"
- No inferimos intención detrás de los datos
- No publicamos datos sin fuente verificable

## La distinción dato duro / dato de contexto

| Tipo | Descripción | Ejemplos |
|---|---|---|
| **Dato duro** | Objetivo, verificable, con fuente oficial | Tasa de fracasos, días sin resolución, puntaje en concurso, senadores que avalaron el pliego |
| **Dato de contexto** | Informativo, requiere interpretación del lector | Vínculo con asociaciones judiciales, origen político de la designación |

Los datos de contexto siempre se presentan con su fuente y sin calificativo editorial.

## Por qué los filtros son parte de la misión

Los filtros de la sección "Causas cajoneadas" no son solo UX — son el mecanismo por el cual el ciudadano ejerce su propio análisis. Un periodista filtra `Cajoneada + CABA + Penal Federal` y descubre el patrón. Un abogado filtra por tipo de causa. Un ciudadano busca su provincia.

El Observatorio provee la infraestructura. El análisis es del usuario.

## Implicaciones para el desarrollo

- Toda feature nueva debe poder responderse: *¿estamos publicando un dato o emitiendo una opinión?*
- Los umbrales (ej: "cajoneada" > 730 días) deben estar respaldados por fuentes oficiales y documentados
- Las URLs de análisis filtrado deben ser compartibles (estado en query params)
- Cada dato sensible debe tener su fuente linkeable en la UI
