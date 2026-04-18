import { Injectable } from '@nestjs/common';
import {
  ArchivoPublico,
  Caso,
  CausaRanking,
  CausasFilter,
  EstadoCausa,
  FindAllParams,
  Judge,
  JudgeWithStats,
  PaginatedResult,
} from './judges.interface';

/**
 * Genera un slug URL-friendly a partir del nombre del juez y su provincia.
 * Ej: ("Dr. Juan Carlos Pérez Gómez", "CABA") → "juan-carlos-perez-gomez-caba"
 */
export function generateSlug(name: string, province: string): string {
  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
      .toLowerCase()
      .replace(/^(dr\.|dra\.)\s+/i, '') // quitar tratamiento
      .replace(/[^a-z0-9\s]/g, '') // solo alfanumérico y espacios
      .trim()
      .replace(/\s+/g, '-'); // espacios → guiones
  return `${normalize(name)}-${normalize(province)}`;
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * DATOS DE PRUEBA — TODOS LOS PERFILES SON FICTICIOS
 * ─────────────────────────────────────────────────────────────────────────────
 * Nombres de magistrados, imputados y expedientes son inventados.
 * El modelo está diseñado para ilustrar el esquema completo que el
 * Observatorio usará con fuentes reales a partir de la versión 1.0.
 *
 * Normativa de referencia:
 *  - Ley 27.146 (organización y competencia de la justicia federal penal)
 *  - Ley 24.050 (organización de la justicia nacional penal)
 *  - Decreto-Ley 1285/58 y modificatorias (organización del PJN)
 *  - Acordada CSJN N° 4/2007 (horario judicial)
 *  - Ley 24.937 y modificatorias (Consejo de la Magistratura)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MOCK_JUDGES: Judge[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // JUEZ 1 — CABA · Primera instancia · Nacional · Ordinaria
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    slug: 'juan-carlos-perez-gomez-caba',
    isDemoData: true,
    name: 'Dr. Juan Carlos Pérez Gómez',
    court: 'Juzgado Nacional en lo Criminal y Correccional N° 7',
    location: {
      country: 'Argentina',
      province: 'CABA',
      department: 'Ciudad Autónoma de Buenos Aires',
    },
    jurisdiction: {
      fuero: 'Criminal y Correccional Nacional',
      instance: 'Primera instancia',
      scope: 'Nacional',
      competence: 'Ordinaria',
    },
    workAddress: 'Av. Comodoro Py 2002, Piso 3, Of. 312 — CABA, CP C1104ADB',
    workHours: 'Lunes a viernes de 07:30 a 13:30 hs. (Acordada CSJN N° 4/2007)',
    salary: {
      grossMonthlyARS: 7_850_000,
      acordada: 'Acordada CSJN N° 7/2024',
      category: 'Juez Nacional de Primera Instancia',
      lastUpdated: 'diciembre 2024',
    },
    appointmentDate: '15 de marzo de 2018',
    appointmentBody: 'Consejo de la Magistratura de la Nación — Decreto PEN N° 512/2018',
    yearsOnBench: 7,
    totalReleases: 491,
    ftaCount: 67,
    newArrestCount: 88,
    revokedCount: 34,
    cases: [
      {
        expediente: '51234/2022',
        defendant: 'López Martínez, Gustavo Adrián (FICTICIO)',
        crime: 'Robo con arma de fuego en grado de tentativa',
        crimeArticle: 'Art. 166 inc. 2 CP',
        decisionType: 'Excarcelación bajo caución real',
        decisionDate: '2022-08-14',
        legalBasis: 'Art. 317 CPPN — ausencia de peligro de fuga y escasa pena en expectativa',
        outcome: 'fta',
        outcomeDate: '2022-11-03',
        outcomeDetail:
          'El imputado no compareció a la audiencia de indagatoria; se libró orden de captura.',
      },
      {
        expediente: '49876/2022',
        defendant: 'Sánchez Vera, Roberto Daniel (FICTICIO)',
        crime: 'Tenencia de estupefacientes con fines de comercialización',
        crimeArticle: 'Art. 5 inc. c) Ley 23.737',
        decisionType: 'Excarcelación bajo caución personal juratoria',
        decisionDate: '2022-09-22',
        legalBasis: 'Art. 317 CPPN — arraigo familiar acreditado y primera causa',
        outcome: 'newArrest',
        outcomeDate: '2023-02-15',
        outcomeDetail:
          'Detenido en flagrancia por robo simple (Art. 164 CP) mientras gozaba de la libertad.',
      },
      {
        expediente: '53102/2023',
        defendant: 'Fernández Quiroga, María Laura (FICTICIO)',
        crime: 'Lesiones graves dolosas',
        crimeArticle: 'Art. 90 CP',
        decisionType: 'Exención de prisión bajo caución real',
        decisionDate: '2023-03-10',
        legalBasis: 'Art. 316 CPPN — pena máxima del delito inferior a ocho años',
        outcome: 'ongoing',
        outcomeDetail: 'Causa en curso. Debate oral fijado para el segundo semestre de 2025.',
      },
      {
        expediente: '47851/2021',
        defendant: 'González Torres, Pablo Ezequiel (FICTICIO)',
        crime: 'Robo simple reiterado (tres hechos)',
        crimeArticle: 'Art. 164 CP en concurso real (Art. 55 CP)',
        decisionType: 'Libertad condicional',
        decisionDate: '2021-11-05',
        legalBasis: 'Art. 13 CP y Art. 28 Ley 24.660 — cumplimiento de 2/3 de condena efectiva',
        outcome: 'revoked',
        outcomeDate: '2022-04-19',
        outcomeDetail:
          'Libertad condicional revocada al ser detenido por una nueva causa (robo agravado).',
      },
      {
        expediente: '55678/2023',
        defendant: 'Ramírez Acosta, Diego Hernán (FICTICIO)',
        crime: 'Amenazas coactivas agravadas',
        crimeArticle: 'Art. 149 bis, 2° párr. CP',
        decisionType: 'Excarcelación bajo caución real',
        decisionDate: '2023-06-28',
        legalBasis: 'Art. 317 CPPN — inexistencia de antecedentes condenatorios',
        outcome: 'fta',
        outcomeDate: '2023-09-14',
        outcomeDetail:
          'Incomparecencia al debate oral. Juicio declarado en rebeldía; se libró orden de captura.',
      },
      {
        expediente: '58901/2023',
        defendant: 'Pérez Navarro, Carlos Ignacio (FICTICIO)',
        crime: 'Robo agravado por el uso de arma blanca',
        crimeArticle: 'Art. 166 inc. 2 CP',
        decisionType: 'Excarcelación bajo caución personal juratoria',
        decisionDate: '2023-10-03',
        legalBasis: 'Art. 317 CPPN — tiempo de detención excede el mínimo de la pena',
        outcome: 'newArrest',
        outcomeDate: '2024-01-22',
        outcomeDetail:
          'Aprehendido en flagrancia por robo a mano armada en el barrio de Palermo, CABA.',
      },
      {
        expediente: '60432/2024',
        defendant: 'Álvarez Medina, Lucas Andrés (FICTICIO)',
        crime: 'Homicidio culposo en siniestro vial',
        crimeArticle: 'Art. 84 bis CP (Ley 27.347)',
        decisionType: 'Exención de prisión bajo caución real',
        decisionDate: '2024-02-19',
        legalBasis:
          'Art. 316 CPPN — delito culposo sin antecedentes; domicilio y trabajo acreditados',
        outcome: 'ongoing',
        outcomeDetail: 'Investigación en trámite. Pericia accidentológica pendiente.',
      },
      {
        expediente: '43210/2021',
        defendant: 'Muñoz Varela, Sebastián Omar (FICTICIO)',
        crime: 'Abuso sexual con acceso carnal',
        crimeArticle: 'Art. 119, 3° párr. CP',
        decisionType: 'Excarcelación bajo caución real',
        decisionDate: '2021-07-30',
        legalBasis:
          'Art. 317 CPPN — tiempo de detención preventiva excede el mínimo de la escala penal',
        outcome: 'revoked',
        outcomeDate: '2021-10-14',
        outcomeDetail: 'Libertad revocada al constatarse contacto no autorizado con la víctima.',
      },
      {
        expediente: '52789/2022',
        defendant: 'Torres Ibáñez, Mario Alberto (FICTICIO)',
        crime: 'Hurto calificado por uso de llave robada',
        crimeArticle: 'Art. 163 inc. 6 CP',
        decisionType: 'Excarcelación bajo caución personal juratoria',
        decisionDate: '2022-06-01',
        legalBasis: 'Art. 317 CPPN — primer delito; familia a cargo',
        outcome: 'ongoing',
        outcomeDetail: 'Causa en etapa de juicio oral. Fecha de debate pendiente.',
      },
      {
        expediente: '61789/2024',
        defendant: 'Castro Ríos, Nicolás Fabián (FICTICIO)',
        crime: 'Estafa y defraudación reiteradas',
        crimeArticle: 'Art. 172 CP en concurso real (Art. 55 CP)',
        decisionType: 'Exención de prisión bajo caución real',
        decisionDate: '2024-04-08',
        legalBasis: 'Art. 316 CPPN — pena en expectativa no supera seis años; domicilio acreditado',
        outcome: 'fta',
        outcomeDate: '2024-07-03',
        outcomeDetail:
          'El imputado no se constituyó en prisión tras denegarse la apelación. ' +
          'Se libró orden de captura nacional e internacional (Interpol).',
      },
    ],
    sourceLinks: [
      {
        label: 'PJN — Consulta de expedientes',
        url: 'https://www.pjn.gov.ar/judiciales/expedientes',
        description: 'Sistema de gestión judicial del Poder Judicial de la Nación.',
      },
      {
        label: 'Consejo de la Magistratura — Legajo del magistrado',
        url: 'https://www.magistratura.gov.ar/magistrados/legajo',
        description:
          'Legajo público: concurso de designación, antecedentes disciplinarios y DJ patrimonial.',
      },
      {
        label: 'CSJN — Acordadas de remuneraciones',
        url: 'https://www.csjn.gov.ar/acordadas/remuneraciones',
        description: 'Acordadas que fijan las remuneraciones del escalafón judicial.',
      },
      {
        label: 'Ministerio Público Fiscal — Resoluciones',
        url: 'https://www.mpf.gov.ar/resoluciones',
        description:
          'Resoluciones del MPF. Complementa el seguimiento con la posición del acusador.',
      },
      {
        label: 'Oficina Anticorrupción — Declaraciones Juradas',
        url: 'https://www.argentina.gob.ar/anticorrupcion/declaraciones-juradas',
        description: 'Declaraciones juradas patrimoniales de magistrados del Poder Judicial.',
      },
      {
        label: 'SAIJ — Sistema Argentino de Información Jurídica',
        url: 'https://www.saij.gob.ar',
        description: 'Base normativa oficial del Estado Nacional. Legislación y jurisprudencia.',
      },
    ],
    associations: [
      {
        name: 'Asociación de Magistrados y Funcionarios de la Justicia Nacional',
        role: 'Miembro activo',
        since: 2018,
        sourceUrl: 'https://www.amfjn.org.ar/magistrados (FICTICIO)',
      },
    ],
    appointmentDetail: {
      politicalOrigin: 'judicial',
      politicalOriginDetail:
        'Trayectoria judicial ascendente: ingresó al fuero como empleado en 2001, ' +
        'accedió a la secretaría en 2009 y concursó para juez en 2017. ' +
        'Sin antecedentes de militancia política partidaria registrada. (FICTICIO)',
      magistraturaScore: 78.4,
      magistraturaRank: 2,
      magistraturaCompetitionId:
        'Concurso N° 312 — Juzgado Nacional Criminal y Correccional (FICTICIO)',
      magistraturaSourceUrl: 'https://www.magistratura.gov.ar/concursos/312 (FICTICIO)',
      senateBackers: [
        'Sen. Carlos Martínez (UCR — CABA) (FICTICIO)',
        'Sen. Laura Rodríguez (PRO — Buenos Aires) (FICTICIO)',
      ],
      senateSession: '8 de febrero de 2018',
      senateRecordUrl: 'https://www.senado.gob.ar/parlamentario/sesiones/2018-02-08 (FICTICIO)',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // JUEZ 2 — BUENOS AIRES · Segunda instancia · Provincial · Ordinaria
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 2,
    slug: 'maria-elena-gutierrez-sosa-buenos-aires',
    isDemoData: true,
    name: 'Dra. María Elena Gutiérrez Sosa',
    court: 'Cámara de Apelación y Garantías en lo Penal — Depto. Judicial La Plata',
    location: {
      country: 'Argentina',
      province: 'Buenos Aires',
      department: 'Depto. Judicial La Plata',
    },
    jurisdiction: {
      fuero: 'Penal',
      instance: 'Segunda instancia (Cámara de apelaciones)',
      scope: 'Provincial',
      competence: 'Ordinaria',
    },
    workAddress: 'Calle 13 N° 820, Piso 4, Sala II — La Plata, Buenos Aires, CP B1900TLH',
    workHours: 'Lunes a viernes de 08:00 a 14:00 hs. (Acordada SCBA N° 3845/2019)',
    salary: {
      grossMonthlyARS: 12_400_000,
      acordada: 'Acordada SCBA N° 12/2024',
      category: 'Juez de Cámara — Poder Judicial Provincia de Buenos Aires',
      lastUpdated: 'diciembre 2024',
    },
    appointmentDate: '4 de agosto de 2015',
    appointmentBody:
      'Consejo de la Magistratura de la Provincia de Buenos Aires — ' +
      'Decreto Gubernatorial N° 1874/2015 (Gobernación PBA)',
    yearsOnBench: 10,
    totalReleases: 728,
    ftaCount: 54,
    newArrestCount: 72,
    revokedCount: 41,

    publicBio:
      'Abogada con especialización en derecho procesal penal y derechos humanos. ' +
      'Ejerció como Defensora Oficial durante ocho años antes de ingresar al Poder Judicial ' +
      'como Jueza de Garantías de Primera Instancia en 2009. Fue promovida a la Cámara de ' +
      'Apelaciones en 2015 tras concurso público de antecedentes y oposición. ' +
      'Ha integrado tribunales de formación judicial dependientes de la SCBA. ' +
      '(Perfil ficticio — datos de prueba)',

    education: [
      {
        degree: 'Abogada (Título de grado)',
        institution: 'Universidad Nacional de La Plata — Facultad de Ciencias Jurídicas y Sociales',
        year: 1998,
      },
      {
        degree: 'Especialización en Derecho Procesal Penal',
        institution: 'Universidad de Buenos Aires — Facultad de Derecho',
        year: 2003,
      },
      {
        degree: 'Diploma en Derechos Humanos y Proceso Penal',
        institution:
          'ILANUD — Instituto Latinoamericano de Naciones Unidas para la Prevención del Delito',
        year: 2007,
      },
    ],

    careerHistory: [
      {
        role: 'Secretaria de Juzgado — Juzgado en lo Correccional N° 3',
        institution: 'Poder Judicial de la Provincia de Buenos Aires',
        period: '1999–2001',
      },
      {
        role: 'Defensora Oficial Adjunta',
        institution: 'Ministerio Público de la Defensa — Depto. Judicial La Plata',
        period: '2001–2009',
      },
      {
        role: 'Jueza de Garantías N° 5 (Primera instancia)',
        institution: 'Poder Judicial de la Provincia de Buenos Aires',
        period: '2009–2015',
      },
      {
        role: 'Jueza de Cámara — Sala II',
        institution: 'Cámara de Apelación y Garantías en lo Penal — La Plata',
        period: '2015–presente',
      },
    ],

    notableDecisions: [
      {
        year: 2018,
        description:
          'Revocó prisión preventiva por considerar que el plazo razonable había sido excedido ' +
          '(18 meses sin elevación a juicio), imponiendo arresto domiciliario con tobillera electrónica.',
        article: 'Art. 7.5 CADH · Art. 189 CPPPBA',
        outcome:
          'El imputado fue beneficiado con la medida alternativa. Posteriormente procesado en juicio oral.',
      },
      {
        year: 2020,
        description:
          'Confirmó la negativa de excarcelación en causa de femicidio en grado de tentativa, ' +
          'valorando el historial de violencia documentado y el riesgo para la víctima.',
        article: 'Art. 171 CPPPBA · Ley 26.485',
        outcome:
          'Imputado permaneció detenido. Sentencia condenatoria posterior a 12 años de prisión.',
      },
      {
        year: 2022,
        description:
          'Declaró la inconstitucionalidad de la detención preventiva automática ' +
          'en causa de reincidencia simple, por exceder el estándar de proporcionalidad.',
        article: 'Art. 170 CPPPBA · Art. 18 CN · Doctrina CIDH',
        outcome: 'Resolución recurrida por la Fiscalía. La SCBA confirmó el criterio de la Cámara.',
      },
    ],

    extendedStats: {
      avgResolutionDays: 12,
      pendingCases: 34,
      recusals: 3,
      appealedDecisions: 187,
      reversedOnAppeal: 22,
      reversalRate: 11.76,
    },

    cases: [
      {
        expediente: '32145/2021 — Sala II',
        defendant: 'Benítez Cáceres, Rodrigo Fabián (FICTICIO)',
        crime: 'Homicidio simple en grado de tentativa',
        crimeArticle: 'Art. 79 en función del Art. 42 CP',
        decisionType: 'Revocación de prisión preventiva — arresto domiciliario',
        decisionDate: '2021-04-20',
        legalBasis:
          'Art. 169 CPPPBA — plazo razonable excedido; se impone medida alternativa menos gravosa',
        outcome: 'newArrest',
        outcomeDate: '2021-09-07',
        outcomeDetail:
          'Detenido por riña con lesiones graves (Art. 90 CP) durante el arresto domiciliario.',
      },
      {
        expediente: '29870/2020 — Sala II',
        defendant: 'Ríos Herrera, Facundo Nicolás (FICTICIO)',
        crime: 'Robo agravado por escalamiento y uso de arma (dos hechos)',
        crimeArticle: 'Art. 166 inc. 1 y 2 CP en concurso real',
        decisionType: 'Confirmación de excarcelación de primera instancia',
        decisionDate: '2020-11-11',
        legalBasis:
          'Art. 171 CPPPBA — primera causa; pena en expectativa no supera el máximo excarcelable',
        outcome: 'fta',
        outcomeDate: '2021-03-22',
        outcomeDetail: 'No compareció al debate oral fijado. Paradero desconocido.',
      },
      {
        expediente: '35402/2022 — Sala II',
        defendant: 'Villanueva Soto, Emilio Darío (FICTICIO)',
        crime: 'Abuso sexual agravado por acceso carnal a menor de 13 años',
        crimeArticle: 'Art. 119, 3° párr. y 4° párr. inc. b) CP',
        decisionType: 'Revocación de exención de prisión — se ordena detención',
        decisionDate: '2022-06-03',
        legalBasis:
          'Art. 171 CPPPBA — peligro real de entorpecimiento de la investigación y amenaza a la víctima',
        outcome: 'ongoing',
        outcomeDetail: 'Causa elevada a juicio oral. Debate previsto para primer trimestre 2025.',
      },
      {
        expediente: '27634/2019 — Sala II',
        defendant: 'Ortega Maldonado, Jorge Luis (FICTICIO)',
        crime: 'Privación ilegítima de la libertad agravada',
        crimeArticle: 'Art. 142 bis, 2° párr. CP',
        decisionType: 'Confirmación de excarcelación bajo caución real',
        decisionDate: '2019-08-15',
        legalBasis:
          'Art. 171 CPPPBA — domicilio estable; familia a cargo; trabajo formal acreditado',
        outcome: 'revoked',
        outcomeDate: '2020-01-10',
        outcomeDetail:
          'Libertad revocada por violación de la restricción de acercamiento a la víctima.',
      },
      {
        expediente: '38711/2023 — Sala II',
        defendant: 'Acevedo Prieto, Daniela Marcela (FICTICIO)',
        crime: 'Administración fraudulenta reiterada',
        crimeArticle: 'Art. 173 inc. 7 CP',
        decisionType: 'Revocación de prisión preventiva — caución real',
        decisionDate: '2023-01-30',
        legalBasis:
          'Art. 169 CPPPBA — inexistencia de peligro de fuga; patrimonio embargado como garantía',
        outcome: 'ongoing',
        outcomeDetail: 'Investigación en etapa de juicio. Peritos contables aún dictaminando.',
      },
      {
        expediente: '40256/2023 — Sala II',
        defendant: 'Morales Espinoza, Cristian Alejandro (FICTICIO)',
        crime: 'Femicidio en grado de tentativa',
        crimeArticle: 'Art. 80 inc. 11 CP en función del Art. 42 CP',
        decisionType: 'Confirmación de prisión preventiva — denegación de excarcelación',
        decisionDate: '2023-05-12',
        legalBasis:
          'Art. 171 CPPPBA — historial de violencia documentado; peligro concreto para la víctima (Ley 26.485)',
        outcome: 'ongoing',
        outcomeDetail: 'Imputado detenido. Juicio oral fijado para segundo semestre 2025.',
      },
      {
        expediente: '25190/2018 — Sala II',
        defendant: 'Vargas Romero, Leandro Ezequiel (FICTICIO)',
        crime: 'Tenencia de arma de guerra y narcotráfico',
        crimeArticle: 'Art. 189 bis CP y Art. 5 inc. c) Ley 23.737',
        decisionType: 'Revocación de excarcelación de primera instancia',
        decisionDate: '2018-10-04',
        legalBasis:
          'Art. 171 CPPPBA — peligro de fuga por ausencia de arraigo; antecedentes condenatorios',
        outcome: 'fta',
        outcomeDate: '2019-02-28',
        outcomeDetail:
          'Imputado se fugó del domicilio durante la tramitación del recurso; orden de captura activa.',
      },
      {
        expediente: '42980/2024 — Sala II',
        defendant: 'Peralta Núñez, Héctor Antonio (FICTICIO)',
        crime: 'Estafa procesal y falsificación de instrumento público',
        crimeArticle: 'Art. 172 y 292 CP en concurso ideal (Art. 54 CP)',
        decisionType: 'Confirmación de exención de prisión bajo caución real',
        decisionDate: '2024-03-18',
        legalBasis:
          'Art. 171 CPPPBA — delito no violento; arraigo laboral y familiar; embargo preventivo dispuesto',
        outcome: 'ongoing',
        outcomeDetail:
          'Causa en instrucción. Peritos calígrafos aún analizando documentación impugnada.',
      },
    ],

    sourceLinks: [
      {
        label: 'SCBA — Consulta de jurisprudencia',
        url: 'https://www.scba.gov.ar/jurisprudencia',
        description:
          'Base de jurisprudencia de la Suprema Corte de Buenos Aires. ' +
          'Incluye fallos de Cámaras de Apelaciones provinciales.',
      },
      {
        label: 'Consejo de la Magistratura PBA — Legajos',
        url: 'https://www.cmcpba.gov.ar/magistrados',
        description:
          'Legajos públicos de magistrados del Poder Judicial de la Provincia de Buenos Aires.',
      },
      {
        label: 'MJUS PBA — Estadísticas judiciales',
        url: 'https://www.gba.gob.ar/ministerio_justicia/estadisticas',
        description:
          'Estadísticas del sistema judicial bonaerense: ingresos, egresos, tiempos de resolución.',
      },
      {
        label: 'Ministerio Público PBA — Causas en trámite',
        url: 'https://www.mpba.gov.ar/causas',
        description: 'Estado de causas del Ministerio Público Fiscal y de la Defensa de la PBA.',
      },
      {
        label: 'Oficina Anticorrupción — Declaraciones Juradas',
        url: 'https://www.argentina.gob.ar/anticorrupcion/declaraciones-juradas',
        description: 'Declaraciones juradas patrimoniales de magistrados provinciales.',
      },
    ],
    associations: [
      {
        name: 'Justicia Legítima',
        role: 'Firmante del acta fundacional',
        since: 2012,
        sourceUrl: 'https://www.justicia-legitima.org.ar/firmantes (FICTICIO)',
      },
      {
        name: 'Asociación de Magistrados de la Provincia de Buenos Aires',
        role: 'Miembro activa',
        since: 2009,
        sourceUrl: 'https://www.ampba.org.ar/socios (FICTICIO)',
      },
    ],
    appointmentDetail: {
      politicalOrigin: 'mixed',
      politicalOriginDetail:
        'Docente universitaria en derecho penal (UBA y UNLP) desde 2001. ' +
        'Ingresó al Poder Judicial bonaerense como defensora en 2006. ' +
        'Su designación en Cámara fue impulsada por el bloque del FPV en la legislatura provincial ' +
        'durante la gestión Kicillof. Figura en el acta fundacional de Justicia Legítima (2012). (FICTICIO)',
      magistraturaScore: 84.1,
      magistraturaRank: 1,
      magistraturaCompetitionId: 'Concurso CMCPBA N° 88 — Cámara Penal La Plata (FICTICIO)',
      magistraturaSourceUrl: 'https://www.cmcpba.gov.ar/concursos/88 (FICTICIO)',
      senateBackers: [],
      senateSession: 'N/A — designación provincial (acuerdo de la Legislatura de Buenos Aires)',
      senateRecordUrl: 'https://www.hcdiputados-ba.gov.ar/sesiones/2019-04-10 (FICTICIO)',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // JUEZ 3 — CÓRDOBA · Primera instancia · Federal · Federal
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 3,
    slug: 'roberto-ernesto-molina-paz-cordoba',
    isDemoData: true,
    name: 'Dr. Roberto Ernesto Molina Paz',
    court: 'Juzgado Federal en lo Criminal y Correccional N° 2 de Córdoba',
    location: {
      country: 'Argentina',
      province: 'Córdoba',
      department: 'Depto. Judicial Capital',
    },
    jurisdiction: {
      fuero: 'Penal Federal',
      instance: 'Primera instancia',
      scope: 'Federal',
      competence: 'Federal',
    },
    workAddress: 'Av. General Paz 102, Piso 5, Of. 512 — Córdoba Capital, CP X5000IYN',
    workHours: 'Lunes a viernes de 07:30 a 13:30 hs. (Acordada CSJN N° 4/2007)',
    salary: {
      grossMonthlyARS: 8_650_000,
      acordada: 'Acordada CSJN N° 7/2024',
      category: 'Juez Federal de Primera Instancia',
      lastUpdated: 'diciembre 2024',
    },
    appointmentDate: '22 de septiembre de 2020',
    appointmentBody: 'Consejo de la Magistratura de la Nación — Decreto PEN N° 884/2020',
    yearsOnBench: 5,
    totalReleases: 213,
    ftaCount: 19,
    newArrestCount: 28,
    revokedCount: 11,

    publicBio:
      'Abogado y doctor en ciencias jurídicas con especialización en derecho penal económico ' +
      'y crimen organizado. Fue fiscal federal adjunto durante diez años, con actuación destacada ' +
      'en causas de narcotráfico y lavado de activos. Obtuvo su designación como juez federal ' +
      'en 2020 tras concurso público de antecedentes y oposición ante el Consejo de la Magistratura. ' +
      'Es docente de posgrado en la Universidad Nacional de Córdoba. ' +
      '(Perfil ficticio — datos de prueba)',

    education: [
      {
        degree: 'Abogado (Título de grado)',
        institution: 'Universidad Nacional de Córdoba — Facultad de Derecho y Ciencias Sociales',
        year: 2001,
      },
      {
        degree: 'Especialización en Derecho Penal',
        institution: 'Universidad Nacional de Córdoba',
        year: 2005,
      },
      {
        degree: 'Doctor en Ciencias Jurídicas',
        institution: 'Universidad Católica de Córdoba',
        year: 2011,
      },
      {
        degree: 'Curso de formación en lavado de activos y financiamiento del terrorismo',
        institution: 'UNODC — Oficina de las Naciones Unidas contra la Droga y el Delito',
        year: 2014,
      },
    ],

    careerHistory: [
      {
        role: 'Secretario Letrado — Juzgado Federal N° 1 de Córdoba',
        institution: 'Poder Judicial de la Nación',
        period: '2002–2005',
      },
      {
        role: 'Fiscal Federal Adjunto',
        institution: 'Ministerio Público Fiscal — Fiscalía Federal N° 3 Córdoba',
        period: '2005–2015',
      },
      {
        role: 'Fiscal Federal (titular)',
        institution: 'Ministerio Público Fiscal — Fiscalía Federal N° 1 Córdoba',
        period: '2015–2020',
      },
      {
        role: 'Juez Federal en lo Criminal y Correccional N° 2',
        institution: 'Poder Judicial de la Nación — Córdoba',
        period: '2020–presente',
      },
      {
        role: 'Docente de posgrado — Derecho Penal Económico',
        institution: 'Universidad Nacional de Córdoba — Facultad de Derecho',
        period: '2012–presente',
      },
    ],

    notableDecisions: [
      {
        year: 2021,
        description:
          'Dictó prisión preventiva en causa de narcotráfico internacional con valoración ' +
          'de prueba digital (escuchas telefónicas y mensajería encriptada) como indicios ' +
          'suficientes de materialidad ilícita y peligro de fuga.',
        article: 'Art. 5 inc. c) Ley 23.737 · Arts. 173-184 CPPF (Ley 27.482)',
        outcome:
          'Prisión preventiva confirmada por la Cámara Federal. ' +
          'Juicio oral con sentencia condenatoria en 2023.',
      },
      {
        year: 2022,
        description:
          'Ordenó la excarcelación de un imputado por lavado de activos al considerar que ' +
          'el embargo de bienes e inhibición general garantizaban el resarcimiento ' +
          'sin necesidad de detención.',
        article: 'Art. 210 CPPF · Arts. 303-304 CP',
        outcome:
          'Ministerio Público Fiscal recurrió. La Cámara Federal revocó la resolución ' +
          'y restituyó la prisión preventiva.',
      },
      {
        year: 2023,
        description:
          'Primera aplicación en la jurisdicción del mecanismo de "salida alternativa" ' +
          'previsto en el CPPF para un caso de tenencia de estupefacientes para consumo personal, ' +
          'evitando la persecución penal mediante acuerdo de suspensión del proceso a prueba.',
        article: 'Art. 5 último párr. Ley 23.737 · Art. 76 bis CP · Art. 35 CPPF',
        outcome:
          'Probation acordada por dos años. Cumplimiento en curso. Sin registros de incumplimiento.',
      },
    ],

    extendedStats: {
      avgResolutionDays: 18,
      pendingCases: 47,
      recusals: 1,
      appealedDecisions: 62,
      reversedOnAppeal: 9,
      reversalRate: 14.52,
    },

    cases: [
      {
        expediente: 'FCB 11234/2021',
        defendant: 'Medina Correa, Alejandro Iván (FICTICIO)',
        crime: 'Narcotráfico — transporte de estupefacientes',
        crimeArticle: 'Art. 5 inc. c) Ley 23.737',
        decisionType: 'Excarcelación bajo caución real y arraigo',
        decisionDate: '2021-05-17',
        legalBasis: 'Arts. 210-221 CPPF — primera causa; domicilio fijo; trabajo acreditado',
        outcome: 'fta',
        outcomeDate: '2021-09-04',
        outcomeDetail:
          'No compareció a la audiencia de control de acusación. ' +
          'Se requirió captura nacional e internacional.',
      },
      {
        expediente: 'FCB 09871/2020',
        defendant: 'Suárez Delgado, Patricia Elena (FICTICIO)',
        crime: 'Lavado de activos provenientes del narcotráfico',
        crimeArticle: 'Art. 303 inc. 1 CP',
        decisionType: 'Exención de prisión bajo caución real y embargo de bienes',
        decisionDate: '2020-12-08',
        legalBasis: 'Art. 210 CPPF — arraigo, bienes embargados superiores al daño estimado',
        outcome: 'revoked',
        outcomeDate: '2021-06-22',
        outcomeDetail:
          'Libertad revocada al detectarse transferencia de fondos al exterior ' +
          'en violación de la prohibición de salida del país.',
      },
      {
        expediente: 'FCB 13450/2022',
        defendant: 'Ibáñez Quiroga, Fernando José (FICTICIO)',
        crime: 'Contrabando agravado de divisas',
        crimeArticle: 'Art. 865 inc. b) Código Aduanero (Ley 22.415)',
        decisionType: 'Excarcelación bajo caución personal juratoria',
        decisionDate: '2022-03-25',
        legalBasis:
          'Art. 210 CPPF — monto de la pena en expectativa no excede el umbral de cautelar',
        outcome: 'ongoing',
        outcomeDetail: 'Causa en etapa de juicio. Debate oral fijado para 2025.',
      },
      {
        expediente: 'FCB 08234/2020',
        defendant: 'Romero Vázquez, Gustavo Ariel (FICTICIO)',
        crime: 'Asociación ilícita para el narcotráfico (jefatura)',
        crimeArticle: 'Art. 210 bis CP y Art. 7 Ley 23.737',
        decisionType: 'Excarcelación bajo caución real — revocada en apelación',
        decisionDate: '2020-08-14',
        legalBasis:
          'Art. 210 CPPF — primera instancia consideró suficiente la caución; ' +
          'Cámara Federal revocó por peligro de fuga y entorpecimiento',
        outcome: 'revoked',
        outcomeDate: '2020-10-30',
        outcomeDetail:
          'Cámara Federal de Apelaciones de Córdoba revocó la excarcelación. ' +
          'Imputado reingresó a prisión preventiva.',
      },
      {
        expediente: 'FCB 15678/2023',
        defendant: 'Cabrera Ríos, Mariela Alejandra (FICTICIO)',
        crime: 'Defraudación al Estado — licitación fraudulenta',
        crimeArticle: 'Art. 174 inc. 5 CP (defraudación contra administración pública)',
        decisionType: 'Exención de prisión bajo caución real',
        decisionDate: '2023-07-19',
        legalBasis: 'Art. 210 CPPF — delito no violento; domicilio fijo; patrimonio embargado',
        outcome: 'ongoing',
        outcomeDetail: 'Investigación en trámite. Peritos contables aún informando.',
      },
      {
        expediente: 'FCB 10456/2021',
        defendant: 'Aguirre Núñez, Maximiliano Sebastián (FICTICIO)',
        crime: 'Tráfico de armas de guerra',
        crimeArticle: 'Art. 189 bis inc. 3 CP — comercialización de armas',
        decisionType: 'Excarcelación bajo caución real',
        decisionDate: '2021-11-02',
        legalBasis: 'Art. 210 CPPF — tiempo de detención excede el mínimo de la pena',
        outcome: 'newArrest',
        outcomeDate: '2022-03-11',
        outcomeDetail:
          'Detenido por nueva tenencia ilegal de arma de guerra en Río Cuarto, Córdoba.',
      },
      {
        expediente: 'FCB 17023/2024',
        defendant: 'Navarro Pereira, Carlos Esteban (FICTICIO)',
        crime: 'Ciberdelito — acceso ilegítimo a sistemas informáticos del Estado',
        crimeArticle: 'Art. 153 bis y 197 CP · Ley 26.388',
        decisionType: 'Exención de prisión bajo caución personal juratoria',
        decisionDate: '2024-01-09',
        legalBasis: 'Art. 210 CPPF — primera causa; sin antecedentes; domicilio y trabajo estables',
        outcome: 'ongoing',
        outcomeDetail: 'Investigación en etapa de instrucción. Peritos informáticos designados.',
      },
      {
        expediente: 'FCB 07891/2019',
        defendant: 'Flores Ramos, Diego Marcelo (FICTICIO)',
        crime: 'Evasión tributaria agravada',
        crimeArticle: 'Art. 2 Ley 24.769 (Régimen Penal Tributario)',
        decisionType: 'Exención de prisión bajo caución real',
        decisionDate: '2019-09-30',
        legalBasis:
          'Art. 316 CPPN (vigente en ese momento) — monto de evasión acreditado; arraigo suficiente',
        outcome: 'fta',
        outcomeDate: '2020-04-17',
        outcomeDetail:
          'El imputado no se presentó al inicio del debate oral. ' +
          'Salió del país con pasaporte no inhabilitado. Orden de captura y alerta Interpol.',
      },
    ],

    sourceLinks: [
      {
        label: 'PJN — Expedientes Federales de Córdoba',
        url: 'https://www.pjn.gov.ar/judiciales/expedientes',
        description:
          'Sistema de gestión judicial. Consulta de causas federales por número de expediente.',
      },
    ],
    associations: [],
    appointmentDetail: {
      politicalOrigin: 'political',
      politicalOriginDetail:
        'Ejerció la abogacía privada en Córdoba durante 15 años antes de su designación. ' +
        'Sin trayectoria previa en el Poder Judicial ni en el Ministerio Público. ' +
        'Su pliego fue impulsado por senadores del PJ cordobés con estrecho vínculo ' +
        'con el gobierno provincial. No registra antecedentes académicos de relevancia. (FICTICIO)',
      magistraturaScore: 61.7,
      magistraturaRank: 3,
      magistraturaCompetitionId: 'Concurso N° 198 — Juzgado Federal Penal Córdoba (FICTICIO)',
      magistraturaSourceUrl: 'https://www.magistratura.gov.ar/concursos/198 (FICTICIO)',
      senateBackers: [
        'Sen. Héctor Olivares (PJ — Córdoba) (FICTICIO)',
        'Sen. Graciela Montes (PJ — Córdoba) (FICTICIO)',
        'Sen. Jorge Barrionuevo (FdT — Santa Fe) (FICTICIO)',
      ],
      senateSession: '3 de septiembre de 2015',
      senateRecordUrl: 'https://www.senado.gob.ar/parlamentario/sesiones/2015-09-03 (FICTICIO)',
    },
  },
];

// ── Datos ficticios: un juez por cada partido de la Provincia de Buenos Aires ──

const BA_PARTIDOS: { name: string; depto: string }[] = [
  { name: 'Lanús', depto: 'Avellaneda-Lanús' },
  { name: 'Avellaneda', depto: 'Avellaneda-Lanús' },
  { name: 'Azul', depto: 'Azul' },
  { name: 'Benito Juárez', depto: 'Azul' },
  { name: 'Bolívar', depto: 'Azul' },
  { name: 'General La Madrid', depto: 'Azul' },
  { name: 'Laprida', depto: 'Azul' },
  { name: 'Las Flores', depto: 'Azul' },
  { name: 'Olavarría', depto: 'Azul' },
  { name: 'Rauch', depto: 'Azul' },
  { name: 'Tandil', depto: 'Azul' },
  { name: 'Tapalqué', depto: 'Azul' },
  { name: 'Adolfo Alsina', depto: 'Bahía Blanca' },
  { name: 'Bahía Blanca', depto: 'Bahía Blanca' },
  { name: 'Coronel de Marina Leonardo Rosales', depto: 'Bahía Blanca' },
  { name: 'Coronel Pringles', depto: 'Bahía Blanca' },
  { name: 'Coronel Suárez', depto: 'Bahía Blanca' },
  { name: 'Monte Hermoso', depto: 'Bahía Blanca' },
  { name: 'Patagones', depto: 'Bahía Blanca' },
  { name: 'Puan', depto: 'Bahía Blanca' },
  { name: 'Saavedra', depto: 'Bahía Blanca' },
  { name: 'Tornquist', depto: 'Bahía Blanca' },
  { name: 'Villarino', depto: 'Bahía Blanca' },
  { name: 'Ayacucho', depto: 'Dolores' },
  { name: 'Castelli', depto: 'Dolores' },
  { name: 'Chascomús', depto: 'Dolores' },
  { name: 'Dolores', depto: 'Dolores' },
  { name: 'General Belgrano', depto: 'Dolores' },
  { name: 'General Guido', depto: 'Dolores' },
  { name: 'General Lavalle', depto: 'Dolores' },
  { name: 'General Madariaga', depto: 'Dolores' },
  { name: 'General Paz', depto: 'Dolores' },
  { name: 'Lezama', depto: 'Dolores' },
  { name: 'Maipú', depto: 'Dolores' },
  { name: 'Monte', depto: 'Dolores' },
  { name: 'Pila', depto: 'Dolores' },
  { name: 'Tordillo', depto: 'Dolores' },
  { name: 'Alberti', depto: 'Junín' },
  { name: 'Bragado', depto: 'Junín' },
  { name: 'Chacabuco', depto: 'Junín' },
  { name: 'Florentino Ameghino', depto: 'Junín' },
  { name: 'General Arenales', depto: 'Junín' },
  { name: 'General Pinto', depto: 'Junín' },
  { name: 'General Viamonte', depto: 'Junín' },
  { name: 'Junín', depto: 'Junín' },
  { name: 'Leandro N. Alem', depto: 'Junín' },
  { name: 'Lincoln', depto: 'Junín' },
  { name: 'Nueve de Julio', depto: 'Junín' },
  { name: 'La Matanza', depto: 'La Matanza' },
  { name: 'Berisso', depto: 'La Plata' },
  { name: 'Brandsen', depto: 'La Plata' },
  { name: 'Cañuelas', depto: 'La Plata' },
  { name: 'Ensenada', depto: 'La Plata' },
  { name: 'La Plata', depto: 'La Plata' },
  { name: 'Magdalena', depto: 'La Plata' },
  { name: 'Punta Indio', depto: 'La Plata' },
  { name: 'San Vicente', depto: 'La Plata' },
  { name: 'Almirante Brown', depto: 'Lomas de Zamora' },
  { name: 'Esteban Echeverría', depto: 'Lomas de Zamora' },
  { name: 'Ezeiza', depto: 'Lomas de Zamora' },
  { name: 'Lomas de Zamora', depto: 'Lomas de Zamora' },
  { name: 'Presidente Perón', depto: 'Lomas de Zamora' },
  { name: 'Balcarce', depto: 'Mar del Plata' },
  { name: 'General Alvarado', depto: 'Mar del Plata' },
  { name: 'General Pueyrredón', depto: 'Mar del Plata' },
  { name: 'La Costa', depto: 'Mar del Plata' },
  { name: 'Mar Chiquita', depto: 'Mar del Plata' },
  { name: 'Pinamar', depto: 'Mar del Plata' },
  { name: 'Villa Gesell', depto: 'Mar del Plata' },
  { name: 'Carmen de Areco', depto: 'Mercedes' },
  { name: 'Chivilcoy', depto: 'Mercedes' },
  { name: 'General Alvear', depto: 'Mercedes' },
  { name: 'General Las Heras', depto: 'Mercedes' },
  { name: 'Lobos', depto: 'Mercedes' },
  { name: 'Luján', depto: 'Mercedes' },
  { name: 'Mercedes', depto: 'Mercedes' },
  { name: 'Navarro', depto: 'Mercedes' },
  { name: 'Roque Pérez', depto: 'Mercedes' },
  { name: 'Saladillo', depto: 'Mercedes' },
  { name: 'San Andrés de Giles', depto: 'Mercedes' },
  { name: 'San Antonio de Areco', depto: 'Mercedes' },
  { name: 'Suipacha', depto: 'Mercedes' },
  { name: 'General Rodríguez', depto: 'Moreno-Gral. Rodríguez' },
  { name: 'Marcos Paz', depto: 'Moreno-Gral. Rodríguez' },
  { name: 'Merlo', depto: 'Moreno-Gral. Rodríguez' },
  { name: 'Moreno', depto: 'Moreno-Gral. Rodríguez' },
  { name: 'Hurlingham', depto: 'Morón' },
  { name: 'Ituzaingó', depto: 'Morón' },
  { name: 'Morón', depto: 'Morón' },
  { name: 'Adolfo Gonzales Chaves', depto: 'Necochea' },
  { name: 'Coronel Dorrego', depto: 'Necochea' },
  { name: 'Lobería', depto: 'Necochea' },
  { name: 'Necochea', depto: 'Necochea' },
  { name: 'San Cayetano', depto: 'Necochea' },
  { name: 'Tres Arroyos', depto: 'Necochea' },
  { name: 'Arrecifes', depto: 'Pergamino' },
  { name: 'Capitán Sarmiento', depto: 'Pergamino' },
  { name: 'Pergamino', depto: 'Pergamino' },
  { name: 'Rojas', depto: 'Pergamino' },
  { name: 'Salto', depto: 'Pergamino' },
  { name: 'Berazategui', depto: 'Quilmes' },
  { name: 'Florencio Varela', depto: 'Quilmes' },
  { name: 'Quilmes', depto: 'Quilmes' },
  { name: 'San Fernando', depto: 'San Isidro' },
  { name: 'San Isidro', depto: 'San Isidro' },
  { name: 'Tigre', depto: 'San Isidro' },
  { name: 'Vicente López', depto: 'San Isidro' },
  { name: 'General San Martín', depto: 'San Martín' },
  { name: 'José C. Paz', depto: 'San Martín' },
  { name: 'Malvinas Argentinas', depto: 'San Martín' },
  { name: 'San Miguel', depto: 'San Martín' },
  { name: 'Tres de Febrero', depto: 'San Martín' },
  { name: 'Baradero', depto: 'San Nicolás' },
  { name: 'Colón', depto: 'San Nicolás' },
  { name: 'Ramallo', depto: 'San Nicolás' },
  { name: 'San Nicolás', depto: 'San Nicolás' },
  { name: 'San Pedro', depto: 'San Nicolás' },
  { name: 'Carlos Casares', depto: 'Trenque Lauquen' },
  { name: 'Carlos Tejedor', depto: 'Trenque Lauquen' },
  { name: 'Daireaux', depto: 'Trenque Lauquen' },
  { name: 'General Villegas', depto: 'Trenque Lauquen' },
  { name: 'Guaminí', depto: 'Trenque Lauquen' },
  { name: 'Hipólito Yrigoyen', depto: 'Trenque Lauquen' },
  { name: 'Pehuajó', depto: 'Trenque Lauquen' },
  { name: 'Pellegrini', depto: 'Trenque Lauquen' },
  { name: 'Rivadavia', depto: 'Trenque Lauquen' },
  { name: 'Salliqueló', depto: 'Trenque Lauquen' },
  { name: 'Trenque Lauquen', depto: 'Trenque Lauquen' },
  { name: 'Tres Lomas', depto: 'Trenque Lauquen' },
  { name: 'Veinticinco de Mayo', depto: 'Trenque Lauquen' },
  { name: 'Campana', depto: 'Zárate-Campana' },
  { name: 'Escobar', depto: 'Zárate-Campana' },
  { name: 'Exaltación de la Cruz', depto: 'Zárate-Campana' },
  { name: 'Pilar', depto: 'Zárate-Campana' },
  { name: 'Zárate', depto: 'Zárate-Campana' },
];

const _FIRST_M = [
  'Carlos',
  'Luis',
  'Roberto',
  'Hernán',
  'Diego',
  'Marcelo',
  'Pablo',
  'Fernando',
  'Gustavo',
  'Daniel',
  'Sergio',
  'Ricardo',
  'Alejandro',
  'Andrés',
  'Javier',
  'Martín',
  'Nicolás',
  'Santiago',
  'Ignacio',
  'Rodrigo',
  'Ezequiel',
  'Matías',
  'Damián',
  'Federico',
  'Leonardo',
];
const _FIRST_F = [
  'María',
  'Ana',
  'Laura',
  'Patricia',
  'Claudia',
  'Silvana',
  'Verónica',
  'Cecilia',
  'Valeria',
  'Florencia',
  'Graciela',
  'Sandra',
  'Roxana',
  'Natalia',
  'Mónica',
  'Carolina',
  'Luciana',
  'Adriana',
  'Beatriz',
  'Karina',
  'Lorena',
  'Mariana',
  'Susana',
  'Gabriela',
  'Noemí',
];
const _LAST = [
  'García',
  'López',
  'Martínez',
  'Rodríguez',
  'González',
  'Pérez',
  'Sánchez',
  'Romero',
  'Torres',
  'Díaz',
  'Álvarez',
  'Fernández',
  'Ruiz',
  'Herrera',
  'Medina',
  'Ríos',
  'Molina',
  'Morales',
  'Suárez',
  'Ramos',
  'Vega',
  'Cruz',
  'Ortiz',
  'Reyes',
  'Mendoza',
  'Gómez',
  'Vargas',
  'Castillo',
  'Flores',
  'Jiménez',
  'Moreno',
  'Castro',
  'Sosa',
  'Acosta',
  'Benítez',
  'Cabrera',
  'Correa',
  'Delgado',
  'Espinosa',
  'Figueroa',
];
const _STREETS = [
  'San Martín',
  'Rivadavia',
  '9 de Julio',
  'Mitre',
  'Belgrano',
  'Hipólito Yrigoyen',
  'Sarmiento',
  'Corrientes',
  'Pueyrredón',
  'Avenida Italia',
];
const _OUTCOMES: Case['outcome'][] = ['fta', 'newArrest', 'revoked', 'ongoing'];
const _CRIMES = [
  'Robo agravado por uso de armas',
  'Lesiones graves dolosas',
  'Amenazas coactivas',
  'Estafa procesal',
  'Daño calificado',
  'Tenencia ilegal de arma de fuego',
  'Robo simple',
  'Hurto calificado',
  'Coacción agravada',
  'Encubrimiento agravado',
];
const _DECISION_TYPES = [
  'Libertad cautelar',
  'Excarcelación bajo caución personal',
  'Prisión preventiva atenuada',
  'Arresto domiciliario',
  'Exención de prisión bajo caución real',
];
const _MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

function _gen<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

const BA_JUDGES: Judge[] = BA_PARTIDOS.map(({ name, depto }, i) => {
  const isFemale = i % 3 === 0;
  const firstName = _gen(isFemale ? _FIRST_F : _FIRST_M, Math.floor(i / 3));
  const title = isFemale ? 'Dra.' : 'Dr.';
  const lastName1 = _gen(_LAST, i * 2);
  const lastName2 = _gen(_LAST, i * 2 + 7);
  const fullName = `${title} ${firstName} ${lastName1} ${lastName2}`;
  const id = i + 4;
  const appointYear = 2007 + (i % 17);
  const years = 2025 - appointYear;
  const salary = 5_800_000 + years * 350_000 + (i % 5) * 120_000;
  const courtNum = (i % 5) + 1;
  const streetNum = 100 + ((i * 43) % 900);
  return {
    id,
    slug: generateSlug(`${firstName} ${lastName1} ${lastName2}`, name),
    isDemoData: true,
    name: fullName,
    court: `Juzgado de Garantías Nº ${courtNum} — ${name}`,
    location: {
      country: 'Argentina',
      province: 'Buenos Aires',
      department: `Depto. Judicial ${depto}`,
      city: name,
    },
    jurisdiction: {
      fuero: 'Penal',
      instance: 'Primera instancia',
      scope: 'Provincial',
      competence: 'Ordinaria',
    },
    workAddress: `Calle ${_gen(_STREETS, i)} N° ${streetNum}, ${name}, Buenos Aires`,
    workHours: 'Lunes a viernes de 08:00 a 14:00 hs. (Acordada SCBA N° 3845/2019)',
    salaryHistory: [
      {
        label: 'Consejo de la Magistratura — Legajo del magistrado',
        url: 'https://www.magistratura.gov.ar/magistrados/legajo',
        description: 'Legajo público: concurso de designación, antecedentes y declaración jurada.',
      },
      {
        label: 'Ministerio Público Fiscal — Procuración General',
        url: 'https://www.mpf.gov.ar',
        description: 'Resoluciones y dictámenes del MPF en causas federales.',
      },
      {
        label: 'UIF — Unidad de Información Financiera',
        url: 'https://www.argentina.gob.ar/uif',
        description:
          'Reportes de operaciones sospechosas y resoluciones en causas de lavado de activos.',
      },
      {
        label: 'AFIP — PROCELAC (Procuraduría de Criminalidad Económica)',
        url: 'https://www.mpf.gov.ar/procelac',
        description: 'Causas de evasión tributaria y delitos económicos en sede federal.',
      },
      {
        label: 'SAIJ — Legislación y jurisprudencia federal',
        url: 'https://www.saij.gob.ar',
        description:
          'Sistema Argentino de Información Jurídica. Base normativa y jurisprudencial oficial.',
      },
    ],
  },
];

const MOCK_CASOS: Caso[] = [
  // ── Juez 1: Pérez Gómez (CABA · Criminal y Correccional Nacional) ─────────
  {
    id: 'c-101',
    judgeId: 1,
    nroExpediente: '98432/2023',
    fechaInicio: '2022-10-15',
    fechaResolucion: '2023-08-14',
    tipoMedida: 'Excarcelación',
    delito: 'Robo agravado',
    resultado: 'nuevo_arresto',
    observaciones: 'Reaprehendido el 02/10/2023 por robo agravado en San Telmo.',
  },
  {
    id: 'c-102',
    judgeId: 1,
    nroExpediente: '12987/2023',
    fechaInicio: '2023-03-20',
    fechaResolucion: '2023-11-03',
    tipoMedida: 'Libertad cautelar',
    delito: 'Hurto calificado',
    resultado: 'fta',
    observaciones: 'No se presentó a la audiencia del 15/12/2023.',
  },
  {
    id: 'c-103',
    judgeId: 1,
    nroExpediente: '45621/2024',
    fechaInicio: '2023-07-05',
    fechaResolucion: '2024-02-20',
    tipoMedida: 'Prisión preventiva atenuada',
    delito: 'Lesiones graves',
    resultado: 'revocada',
    observaciones: 'La Cámara revocó por incumplimiento de reglas de conducta.',
  },
  {
    id: 'c-104',
    judgeId: 1,
    nroExpediente: '67890/2022',
    fechaInicio: '2022-08-10', // > 730 días → alta-demora
    tipoMedida: 'Libertad bajo caución real',
    delito: 'Portación ilegal de arma de fuego',
    resultado: 'pendiente',
  },
  // ── Jueza 2: Gutiérrez Sosa (Buenos Aires · La Plata · Penal Provincial) ──
  {
    id: 'c-201',
    judgeId: 2,
    nroExpediente: '33210/2023',
    fechaInicio: '2023-01-10',
    fechaResolucion: '2023-07-22',
    tipoMedida: 'Libertad cautelar',
    delito: 'Estafa',
    resultado: 'fta',
    observaciones: 'Paradero desconocido desde agosto de 2023.',
  },
  {
    id: 'c-202',
    judgeId: 2,
    nroExpediente: '54871/2023',
    fechaInicio: '2023-05-20',
    fechaResolucion: '2023-12-01',
    tipoMedida: 'Excarcelación',
    delito: 'Tentativa de homicidio',
    resultado: 'nuevo_arresto',
    observaciones: 'Detenido nuevamente el 18/01/2024 por tentativa de homicidio.',
  },
  {
    id: 'c-203',
    judgeId: 2,
    nroExpediente: '11023/2024',
    fechaInicio: '2024-09-15', // 365–730 días → demora-moderada
    tipoMedida: 'Arresto domiciliario',
    delito: 'Amenazas calificadas',
    resultado: 'pendiente',
  },
  // ── Juez 3: Molina Paz (Córdoba · Penal Federal) ──────────────────────────
  {
    id: 'c-301',
    judgeId: 3,
    nroExpediente: '78123/2022',
    fechaInicio: '2022-01-15',
    fechaResolucion: '2022-09-05',
    tipoMedida: 'Excarcelación',
    delito: 'Narcotráfico',
    resultado: 'nuevo_arresto',
    observaciones: 'Detenido por segundo hecho el 22/10/2022 en Palermo.',
  },
  {
    id: 'c-302',
    judgeId: 3,
    nroExpediente: '90045/2022',
    fechaInicio: '2022-04-25',
    fechaResolucion: '2022-11-18',
    tipoMedida: 'Libertad cautelar',
    delito: 'Contrabando',
    resultado: 'fta',
  },
  {
    id: 'c-303',
    judgeId: 3,
    nroExpediente: '14532/2022',
    fechaInicio: '2022-09-10',
    fechaResolucion: '2023-04-07',
    tipoMedida: 'Libertad bajo caución juratoria',
    delito: 'Corrupción de funcionario público',
    resultado: 'revocada',
    observaciones: 'Revocada por reiteración delictiva comprobada.',
  },
  {
    id: 'c-304',
    judgeId: 3,
    nroExpediente: '62791/2023',
    fechaInicio: '2023-03-01',
    fechaResolucion: '2023-09-30',
    tipoMedida: 'Prisión preventiva atenuada',
    delito: 'Lavado de activos',
    resultado: 'nuevo_arresto',
  },
  {
    id: 'c-305',
    judgeId: 3,
    nroExpediente: '29841/2025',
    fechaInicio: '2025-12-05', // < 365 días → activa
    tipoMedida: 'Excarcelación',
    delito: 'Defraudación al Estado',
    resultado: 'pendiente',
  },
  // ── Jueza 4: Castro Ruiz (CABA · Criminal y Correccional Nacional) ─────────
  {
    id: 'c-401',
    judgeId: 4,
    nroExpediente: '43219/2023',
    fechaInicio: '2022-12-01',
    fechaResolucion: '2023-06-14',
    tipoMedida: 'Libertad cautelar',
    delito: 'Robo con arma de fuego',
    resultado: 'fta',
    observaciones: 'Incomparecencia a audiencia de control del 20/07/2023.',
  },
  {
    id: 'c-402',
    judgeId: 4,
    nroExpediente: '87654/2021',
    fechaInicio: '2021-11-10', // > 730 días → alta-demora
    tipoMedida: 'Excarcelación',
    delito: 'Daño agravado',
    resultado: 'pendiente',
  },
  {
    id: 'c-403',
    judgeId: 4,
    nroExpediente: '55320/2023',
    fechaInicio: '2023-09-15',
    fechaResolucion: '2024-04-03',
    tipoMedida: 'Arresto domiciliario',
    delito: 'Amenazas',
    resultado: 'revocada',
    observaciones: 'Quebrantó condiciones del arresto domiciliario.',
  },
  // ── Juez 5: Torres Ibáñez (Buenos Aires · La Matanza · Penal Provincial) ──
  {
    id: 'c-501',
    judgeId: 5,
    nroExpediente: '31456/2022',
    fechaInicio: '2022-05-20',
    fechaResolucion: '2022-10-11',
    tipoMedida: 'Excarcelación',
    delito: 'Robo simple',
    resultado: 'nuevo_arresto',
    observaciones: 'Nuevo hecho delictivo el 05/11/2022.',
  },
  {
    id: 'c-502',
    judgeId: 5,
    nroExpediente: '79023/2022',
    fechaInicio: '2022-09-01',
    fechaResolucion: '2023-03-20',
    tipoMedida: 'Libertad cautelar',
    delito: 'Hurto',
    resultado: 'fta',
  },
  {
    id: 'c-503',
    judgeId: 5,
    nroExpediente: '15678/2023',
    fechaInicio: '2023-02-14',
    fechaResolucion: '2023-08-09',
    tipoMedida: 'Libertad bajo caución real',
    delito: 'Lesiones leves',
    resultado: 'revocada',
  },
  {
    id: 'c-504',
    judgeId: 5,
    nroExpediente: '48921/2024',
    fechaInicio: '2024-11-08', // 365–730 días → demora-moderada
    tipoMedida: 'Prisión preventiva atenuada',
    delito: 'Violación de domicilio',
    resultado: 'pendiente',
  },
  // ── Jueza 6: González Ruiz (Buenos Aires · La Matanza · Penal Provincial) ─
  {
    id: 'c-601',
    judgeId: 6,
    nroExpediente: '22134/2022',
    fechaInicio: '2022-02-10',
    fechaResolucion: '2022-08-30',
    tipoMedida: 'Excarcelación',
    delito: 'Robo calificado',
    resultado: 'nuevo_arresto',
    observaciones: 'Arrestado por robo calificado el 14/09/2022.',
  },
  {
    id: 'c-602',
    judgeId: 6,
    nroExpediente: '66543/2022',
    fechaInicio: '2022-06-20',
    fechaResolucion: '2022-12-15',
    tipoMedida: 'Libertad cautelar',
    delito: 'Daño simple',
    resultado: 'fta',
    observaciones: 'Sin noticias del imputado desde enero 2023.',
  },
  {
    id: 'c-603',
    judgeId: 6,
    nroExpediente: '10982/2022',
    fechaInicio: '2022-11-30',
    fechaResolucion: '2023-05-04',
    tipoMedida: 'Libertad bajo caución juratoria',
    delito: 'Estafa',
    resultado: 'revocada',
  },
  {
    id: 'c-604',
    judgeId: 6,
    nroExpediente: '39871/2023',
    fechaInicio: '2023-08-10',
    fechaResolucion: '2024-03-28',
    tipoMedida: 'Arresto domiciliario',
    delito: 'Homicidio culposo',
    resultado: 'nuevo_arresto',
    observaciones: 'Quebrantó el arresto y cometió nuevo delito.',
  },
  // ── Jueza 7: Pereyra Blanco (Buenos Aires · La Plata · Penal Provincial) ──
  {
    id: 'c-701',
    judgeId: 7,
    nroExpediente: '57831/2022',
    fechaInicio: '2022-07-05',
    fechaResolucion: '2023-02-17',
    tipoMedida: 'Libertad cautelar',
    delito: 'Abuso sexual',
    resultado: 'fta',
    observaciones: 'No compareció al control mensual del 17/03/2023.',
  },
  {
    id: 'c-702',
    judgeId: 7,
    nroExpediente: '84290/2023',
    fechaInicio: '2023-03-10',
    fechaResolucion: '2023-09-22',
    tipoMedida: 'Excarcelación',
    delito: 'Lesiones graves',
    resultado: 'nuevo_arresto',
  },
  {
    id: 'c-703',
    judgeId: 7,
    nroExpediente: '27654/2023',
    fechaInicio: '2023-06-20', // > 730 días → alta-demora
    tipoMedida: 'Prisión preventiva atenuada',
    delito: 'Narcotráfico (tenencia simple)',
    resultado: 'pendiente',
  },
  // ── Juez 8: Méndez Vega (Buenos Aires · La Plata · Penal Federal) ─────────
  {
    id: 'c-801',
    judgeId: 8,
    nroExpediente: '19023/2022',
    fechaInicio: '2022-10-20',
    fechaResolucion: '2023-04-14',
    tipoMedida: 'Excarcelación',
    delito: 'Peculado',
    resultado: 'revocada',
    observaciones: 'Revocada por la Cámara ante reiteración delictiva.',
  },
  {
    id: 'c-802',
    judgeId: 8,
    nroExpediente: '63410/2023',
    fechaInicio: '2023-04-05',
    fechaResolucion: '2023-10-30',
    tipoMedida: 'Libertad bajo caución real',
    delito: 'Administración fraudulenta',
    resultado: 'fta',
  },
  {
    id: 'c-803',
    judgeId: 8,
    nroExpediente: '41287/2026',
    fechaInicio: '2026-01-15', // < 365 días → activa
    tipoMedida: 'Libertad cautelar',
    delito: 'Soborno',
    resultado: 'pendiente',
  },
  // ── Jueza 9: Fernández Ríos (Córdoba · Penal Provincial) ─────────────────
  {
    id: 'c-901',
    judgeId: 9,
    nroExpediente: '72341/2022',
    fechaInicio: '2022-11-10',
    fechaResolucion: '2023-05-08',
    tipoMedida: 'Libertad cautelar',
    delito: 'Robo en poblado y en banda',
    resultado: 'fta',
  },
  {
    id: 'c-902',
    judgeId: 9,
    nroExpediente: '35912/2023',
    fechaInicio: '2023-05-01',
    fechaResolucion: '2023-11-14',
    tipoMedida: 'Excarcelación',
    delito: 'Tentativa de robo',
    resultado: 'nuevo_arresto',
    observaciones: 'Detenido por hecho independiente el 09/12/2023.',
  },
  {
    id: 'c-903',
    judgeId: 9,
    nroExpediente: '88124/2024',
    fechaInicio: '2024-08-25', // 365–730 días → demora-moderada
    tipoMedida: 'Prisión preventiva atenuada',
    delito: 'Extorsión',
    resultado: 'pendiente',
  },
  // ── Jueza 10: Ramos Prieto (Córdoba · Penal Federal) ─────────────────────
  {
    id: 'c-1001',
    judgeId: 10,
    nroExpediente: '29087/2022',
    fechaInicio: '2022-12-15',
    fechaResolucion: '2023-06-19',
    tipoMedida: 'Libertad bajo caución juratoria',
    delito: 'Defraudación al Estado',
    resultado: 'fta',
    observaciones: 'Incomparecencia sin justificación.',
  },
  {
    id: 'c-1002',
    judgeId: 10,
    nroExpediente: '51340/2023',
    fechaInicio: '2023-05-25',
    fechaResolucion: '2023-12-05',
    tipoMedida: 'Excarcelación',
    delito: 'Malversación de caudales públicos',
    resultado: 'nuevo_arresto',
  },
  {
    id: 'c-1003',
    judgeId: 10,
    nroExpediente: '17623/2023',
    fechaInicio: '2023-10-10', // > 730 días → alta-demora
    tipoMedida: 'Libertad cautelar',
    delito: 'Encubrimiento agravado',
    resultado: 'pendiente',
  },
  // ── Juez 11: Herrera Montoya (Santa Fe · Rosario · Penal Provincial) ──────
  {
    id: 'c-1101',
    judgeId: 11,
    nroExpediente: '84561/2021',
    fechaInicio: '2021-12-05',
    fechaResolucion: '2022-07-22',
    tipoMedida: 'Excarcelación',
    delito: 'Homicidio doloso',
    resultado: 'nuevo_arresto',
    observaciones: 'Nuevo hecho el 08/08/2022 en zona norte de Rosario.',
  },
  {
    id: 'c-1102',
    judgeId: 11,
    nroExpediente: '43219/2022',
    fechaInicio: '2022-04-01',
    fechaResolucion: '2022-11-10',
    tipoMedida: 'Libertad cautelar',
    delito: 'Portación ilegal de arma',
    resultado: 'fta',
  },
  {
    id: 'c-1103',
    judgeId: 11,
    nroExpediente: '19034/2022',
    fechaInicio: '2022-09-20',
    fechaResolucion: '2023-04-25',
    tipoMedida: 'Libertad bajo caución real',
    delito: 'Robo con arma blanca',
    resultado: 'revocada',
    observaciones: 'La Sala revocó la medida por inconducta procesal reiterada.',
  },
  {
    id: 'c-1104',
    judgeId: 11,
    nroExpediente: '67821/2023',
    fechaInicio: '2023-02-05',
    fechaResolucion: '2023-09-03',
    tipoMedida: 'Arresto domiciliario',
    delito: 'Lesiones graves',
    resultado: 'nuevo_arresto',
  },
  {
    id: 'c-1105',
    judgeId: 11,
    nroExpediente: '32456/2025',
    fechaInicio: '2025-11-20', // < 365 días → activa
    tipoMedida: 'Excarcelación',
    delito: 'Amenazas con arma',
    resultado: 'pendiente',
  },
  // ── Juez 12: Molina Sosa (Santa Fe · Rosario · Penal Federal) ────────────
  {
    id: 'c-1201',
    judgeId: 12,
    nroExpediente: '91230/2022',
    fechaInicio: '2022-08-25',
    fechaResolucion: '2023-03-11',
    tipoMedida: 'Libertad cautelar',
    delito: 'Narcotráfico',
    resultado: 'fta',
    observaciones: 'Incomparecencia a audiencia del 14/04/2023.',
  },
  {
    id: 'c-1202',
    judgeId: 12,
    nroExpediente: '58743/2023',
    fechaInicio: '2023-01-20',
    fechaResolucion: '2023-08-29',
    tipoMedida: 'Excarcelación',
    delito: 'Contrabando agravado',
    resultado: 'nuevo_arresto',
  },
  {
    id: 'c-1203',
    judgeId: 12,
    nroExpediente: '24891/2024',
    fechaInicio: '2024-12-10', // 365–730 días → demora-moderada
    tipoMedida: 'Arresto domiciliario',
    delito: 'Lavado de activos',
    resultado: 'pendiente',
  },
];

const MOCK_ARCHIVOS: ArchivoPublico[] = [
  {
    id: 'a-101',
    judgeId: 1,
    nombre: 'Resolución excarcelación 98432-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-08-20',
  },
  {
    id: 'a-102',
    judgeId: 1,
    nombre: 'Acta audiencia 12987-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-11-10',
  },
  {
    id: 'a-201',
    judgeId: 2,
    nombre: 'Resolución libertad cautelar 33210-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-07-28',
  },
  {
    id: 'a-301',
    judgeId: 3,
    nombre: 'Resolución excarcelación 78123-2022.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2022-09-12',
  },
  {
    id: 'a-302',
    judgeId: 3,
    nombre: 'Dictamen fiscal 90045-2022.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2022-11-25',
  },
  {
    id: 'a-401',
    judgeId: 4,
    nombre: 'Acta audiencia 43219-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-06-20',
  },
  {
    id: 'a-501',
    judgeId: 5,
    nombre: 'Resolución excarcelación 31456-2022.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2022-10-18',
  },
  {
    id: 'a-601',
    judgeId: 6,
    nombre: 'Resolución excarcelación 22134-2022.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2022-09-05',
  },
  {
    id: 'a-602',
    judgeId: 6,
    nombre: 'Informe de incomparecencia 66543-2022.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-01-08',
  },
  {
    id: 'a-701',
    judgeId: 7,
    nombre: 'Acta audiencia 57831-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-02-24',
  },
  {
    id: 'a-801',
    judgeId: 8,
    nombre: 'Resolución revocatoria 19023-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-04-20',
  },
  {
    id: 'a-901',
    judgeId: 9,
    nombre: 'Acta de incomparecencia 72341-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-05-15',
  },
  {
    id: 'a-1001',
    judgeId: 10,
    nombre: 'Resolución excarcelación 29087-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-06-25',
  },
  {
    id: 'a-1101',
    judgeId: 11,
    nombre: 'Resolución excarcelación 84561-2022.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2022-07-28',
  },
  {
    id: 'a-1102',
    judgeId: 11,
    nombre: 'Resolución revocatoria 19034-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-05-02',
  },
  {
    id: 'a-1201',
    judgeId: 12,
    nombre: 'Acta de incomparecencia 91230-2023.pdf',
    url: 'https://www.boletinoficial.gob.ar/',
    fechaCarga: '2023-03-18',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Lookup de datos mínimos de juez para el ranking de causas.
// Los jueces 1–3 tienen perfil completo en MOCK_JUDGES; los demás solo tienen
// los campos necesarios para la vista /causas.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_JUDGE_INFO: Record<
  number,
  {
    slug: string;
    name: string;
    provincia: string;
    fuero: string;
    alcance: 'Nacional' | 'Federal' | 'Provincial';
  }
> = {
  1: {
    slug: 'juan-carlos-perez-gomez-caba',
    name: 'Dr. Juan Carlos Pérez Gómez',
    provincia: 'CABA',
    fuero: 'Criminal y Correccional Nacional',
    alcance: 'Nacional',
  },
  2: {
    slug: 'maria-elena-gutierrez-sosa-buenos-aires',
    name: 'Dra. María Elena Gutiérrez Sosa',
    provincia: 'Buenos Aires',
    fuero: 'Penal',
    alcance: 'Provincial',
  },
  3: {
    slug: 'roberto-ernesto-molina-paz-cordoba',
    name: 'Dr. Roberto Ernesto Molina Paz',
    provincia: 'Córdoba',
    fuero: 'Penal Federal',
    alcance: 'Federal',
  },
  4: {
    slug: 'valeria-castro-ruiz-caba',
    name: 'Dra. Valeria Castro Ruiz',
    provincia: 'CABA',
    fuero: 'Criminal y Correccional Nacional',
    alcance: 'Nacional',
  },
  5: {
    slug: 'marcos-torres-ibanez-buenos-aires',
    name: 'Dr. Marcos Torres Ibáñez',
    provincia: 'Buenos Aires',
    fuero: 'Penal',
    alcance: 'Provincial',
  },
  6: {
    slug: 'claudia-gonzalez-ruiz-buenos-aires',
    name: 'Dra. Claudia González Ruiz',
    provincia: 'Buenos Aires',
    fuero: 'Penal',
    alcance: 'Provincial',
  },
  7: {
    slug: 'susana-pereyra-blanco-buenos-aires',
    name: 'Dra. Susana Pereyra Blanco',
    provincia: 'Buenos Aires',
    fuero: 'Penal',
    alcance: 'Provincial',
  },
  8: {
    slug: 'horacio-mendez-vega-buenos-aires',
    name: 'Dr. Horacio Méndez Vega',
    provincia: 'Buenos Aires',
    fuero: 'Penal Federal',
    alcance: 'Federal',
  },
  9: {
    slug: 'patricia-fernandez-rios-cordoba',
    name: 'Dra. Patricia Fernández Ríos',
    provincia: 'Córdoba',
    fuero: 'Penal',
    alcance: 'Provincial',
  },
  10: {
    slug: 'elena-ramos-prieto-cordoba',
    name: 'Dra. Elena Ramos Prieto',
    provincia: 'Córdoba',
    fuero: 'Penal Federal',
    alcance: 'Federal',
  },
  11: {
    slug: 'alejandro-herrera-montoya-santa-fe',
    name: 'Dr. Alejandro Herrera Montoya',
    provincia: 'Santa Fe',
    fuero: 'Penal',
    alcance: 'Provincial',
  },
  12: {
    slug: 'gonzalo-molina-sosa-santa-fe',
    name: 'Dr. Gonzalo Molina Sosa',
    provincia: 'Santa Fe',
    fuero: 'Penal Federal',
    alcance: 'Federal',
  },
};

/**
 * Calcula el estado de una causa según días desde inicio y presencia de resolución.
 * Umbrales basados en la mediana del proceso penal argentino (Procuración General de la Nación).
 * Fuente: https://www.mpf.gob.ar/docs/RepositorioB/Ebooks/qE533.pdf
 *
 * Los valores devueltos son descriptivos del tiempo transcurrido y NO implican
 * juicio sobre la conducta del magistrado.
 */
export function calcularEstadoCausa(fechaInicio: string, tieneResolucion: boolean): EstadoCausa {
  if (tieneResolucion) return 'resuelta';
  const inicio = new Date(fechaInicio);
  const hoy = new Date();
  const dias = Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  if (dias < 365) return 'activa';
  if (dias <= 730) return 'demora-moderada';
  return 'alta-demora';
}

@Injectable()
export class JudgesService {
  private withStats(judge: Judge): JudgeWithStats {
    const totalFailures = judge.ftaCount + judge.newArrestCount + judge.revokedCount;
    const failureRate =
      judge.totalReleases > 0
        ? parseFloat(((totalFailures / judge.totalReleases) * 100).toFixed(2))
        : 0;
    return { ...judge, totalFailures, failureRate };
  }

  findAll(params: FindAllParams = {}): PaginatedResult<JudgeWithStats> {
    const {
      page = 1,
      limit = 9,
      province,
      department,
      city,
      search,
      fuero,
      instance,
      scope,
      salaryBand,
      yearsBand,
      sortKey = 'failureRate',
      sortDir = 'desc',
    } = params;

    let all = MOCK_JUDGES.map((j) => this.withStats(j));

    if (province) all = all.filter((j) => j.location.province === province);
    if (department) all = all.filter((j) => j.location.department === department);
    if (city) all = all.filter((j) => j.location.city === city);
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.court.toLowerCase().includes(q) ||
          j.location.province.toLowerCase().includes(q) ||
          j.location.department.toLowerCase().includes(q) ||
          j.jurisdiction.fuero.toLowerCase().includes(q),
      );
    }
    if (fuero) all = all.filter((j) => j.jurisdiction.fuero === fuero);
    if (instance) all = all.filter((j) => j.jurisdiction.instance === instance);
    if (scope) all = all.filter((j) => j.jurisdiction.scope === scope);
    if (salaryBand) {
      all = all.filter((j) => {
        const gross = j.salary?.grossMonthlyARS ?? 0;
        if (salaryBand === 'baja') return gross < 6_000_000;
        if (salaryBand === 'media') return gross >= 6_000_000 && gross <= 10_000_000;
        return gross > 10_000_000;
      });
    }
    if (yearsBand) {
      all = all.filter((j) => {
        if (yearsBand === 'junior') return j.yearsOnBench < 5;
        if (yearsBand === 'mid') return j.yearsOnBench >= 5 && j.yearsOnBench <= 15;
        return j.yearsOnBench > 15;
      });
    }

    all.sort((a, b) => {
      const av = sortKey === 'name' ? a.name : (a[sortKey] as number);
      const bv = sortKey === 'name' ? b.name : (b[sortKey] as number);
      if (typeof av === 'string' && typeof bv === 'string')
        return sortDir === 'asc' ? av.localeCompare(bv, 'es') : bv.localeCompare(av, 'es');
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const data = all.slice((safePage - 1) * limit, safePage * limit);
    return { data, total, page: safePage, limit, totalPages };
  }

  findOne(id: number): JudgeWithStats | undefined {
    return MOCK_JUDGES.map((j) => this.withStats(j)).find((j) => j.id === id);
  }

  findBySlug(slug: string): JudgeWithStats | undefined {
    const j = MOCK_JUDGES.find((j) => j.slug === slug);
    return j ? this.withStats(j) : undefined;
  }

  getLocationCounts(): {
    byProvince: Record<string, number>;
    byDepto: Record<string, number>;
    byCity: Record<string, number>;
  } {
    return MOCK_JUDGES.reduce(
      (acc, j) => {
        acc.byProvince[j.location.province] = (acc.byProvince[j.location.province] ?? 0) + 1;
        const dept = j.location.department?.replace(/^Depto\. Judicial\s+/, '') ?? '';
        if (dept) acc.byDepto[dept] = (acc.byDepto[dept] ?? 0) + 1;
        if (j.location.city) acc.byCity[j.location.city] = (acc.byCity[j.location.city] ?? 0) + 1;
        return acc;
      },
      {
        byProvince: {} as Record<string, number>,
        byDepto: {} as Record<string, number>,
        byCity: {} as Record<string, number>,
      },
    );
  }

  getFilterOptions(): { fueros: string[]; instances: string[]; scopes: string[] } {
    return {
      fueros: [...new Set(MOCK_JUDGES.map((j) => j.jurisdiction.fuero))].sort(),
      instances: [...new Set(MOCK_JUDGES.map((j) => j.jurisdiction.instance))].sort(),
      scopes: [...new Set(MOCK_JUDGES.map((j) => j.jurisdiction.scope))].sort(),
    };
  }

  getStatsByJudge(judgeId: number) {
    const judge = this.findOne(judgeId);
    if (!judge) return null;
    return {
      totalReleases: judge.totalReleases,
      ftaCount: judge.ftaCount,
      newArrestCount: judge.newArrestCount,
      revokedCount: judge.revokedCount,
      failureRate: judge.failureRate,
    };
  }

  getRawData(): Judge[] {
    return MOCK_JUDGES;
  }

  findAllRaw(): JudgeWithStats[] {
    return MOCK_JUDGES.map((j) => this.withStats(j));
  }

  getCasosByJudge(judgeId: number, page = 1, limit = 10): PaginatedResult<Caso> {
    const all = MOCK_CASOS.filter((c) => c.judgeId === judgeId);
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const safePage = Math.min(Math.max(1, page), totalPages || 1);
    const data = all.slice((safePage - 1) * limit, safePage * limit);
    return { data, total, page: safePage, limit, totalPages };
  }

  getArchivosByJudge(judgeId: number): ArchivoPublico[] {
    return MOCK_ARCHIVOS.filter((a) => a.judgeId === judgeId);
  }

  /**
   * Construye el ranking global de causas, ordenado por diasDesdeInicio DESC.
   * Aplica los filtros de CausasFilter (AND acumulativo).
   */
  getCausasRanking(filter: CausasFilter = {}): PaginatedResult<CausaRanking> {
    const hoy = new Date();

    let items: CausaRanking[] = MOCK_CASOS.map((caso) => {
      const info = MOCK_JUDGE_INFO[caso.judgeId];
      if (!info) return null;

      const tieneResolucion = caso.resultado !== 'pendiente';
      const inicio = new Date(caso.fechaInicio);
      const diasDesdeInicio = Math.floor(
        (hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24),
      );
      const estadoCausa = calcularEstadoCausa(caso.fechaInicio, tieneResolucion);

      return {
        expediente: caso.nroExpediente,
        judgeSlug: info.slug,
        judgeName: info.name,
        provincia: info.provincia,
        fuero: info.fuero,
        alcance: info.alcance,
        delito: caso.delito ?? '',
        fechaInicio: caso.fechaInicio,
        diasDesdeInicio,
        estadoCausa,
        tieneResolucion,
      } satisfies CausaRanking;
    }).filter((item): item is CausaRanking => item !== null);

    // ── Filtros ────────────────────────────────────────────────────────────────
    if (filter.estado && filter.estado !== 'todas') {
      items = items.filter((i) => i.estadoCausa === filter.estado);
    }
    if (filter.provincia) {
      items = items.filter((i) => i.provincia.toLowerCase() === filter.provincia!.toLowerCase());
    }
    if (filter.fuero) {
      items = items.filter((i) => i.fuero.toLowerCase().includes(filter.fuero!.toLowerCase()));
    }
    if (filter.alcance) {
      items = items.filter((i) => i.alcance === filter.alcance);
    }
    if (filter.delito) {
      items = items.filter((i) => i.delito.toLowerCase().includes(filter.delito!.toLowerCase()));
    }

    // ── Ordenar por diasDesdeInicio DESC (sin resolución primero) ─────────────
    items.sort((a, b) => b.diasDesdeInicio - a.diasDesdeInicio);

    // ── Paginación ─────────────────────────────────────────────────────────────
    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.max(1, filter.limit ?? 20);
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const safePage = Math.min(page, totalPages);
    const data = items.slice((safePage - 1) * limit, safePage * limit);

    return { data, total, page: safePage, limit, totalPages };
  }

  /**
   * Ranking de causas filtrado al juez identificado por slug.
   * Sin paginación: devuelve todas las causas del juez.
   */
  getCausasRankingByJudge(slug: string): CausaRanking[] {
    const entry = Object.entries(MOCK_JUDGE_INFO).find(([, info]) => info.slug === slug);
    if (!entry) return [];
    const judgeId = parseInt(entry[0], 10);

    const filter: CausasFilter = { limit: 1000, page: 1 };
    const all = this.getCausasRanking(filter);
    return all.data.filter(
      (c) =>
        c.judgeSlug === slug ||
        MOCK_CASOS.some((caso) => caso.judgeId === judgeId && caso.nroExpediente === c.expediente),
    );
  }
}
