import { Injectable } from '@nestjs/common';
import {
  ArchivoPublico,
  Case,
  Judge,
  JudgeWithStats,
  PaginatedResult,
  SalaryRecord,
} from './judges.interface';

export function generateSlug(name: string, province: string): string {
  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/^(dr\.|dra\.)\s+/i, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  return `${normalize(name)}-${normalize(province)}`;
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * DATOS DE PRUEBA — TODOS LOS PERFILES SON FICTICIOS
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MOCK_JUDGES_BASE: Judge[] = [
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
    salaryHistory: [
      {
        grossMonthlyARS: 6_200_000,
        acordada: 'Acordada CSJN N° 3/2023',
        category: 'Juez Nacional de Primera Instancia',
        validFrom: '2023-01-01',
        validTo: '2023-12-31',
      },
      {
        grossMonthlyARS: 7_850_000,
        acordada: 'Acordada CSJN N° 7/2024',
        category: 'Juez Nacional de Primera Instancia',
        validFrom: '2024-01-01',
        validTo: null,
      },
    ],
    appointmentDate: '15 de marzo de 2018',
    appointmentBody: 'Consejo de la Magistratura de la Nación — Decreto PEN N° 512/2018',
    yearsOnBench: 7,
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
        'Trayectoria judicial ascendente sin antecedentes de militancia política partidaria registrada. (FICTICIO)',
      politicalOriginSources: [
        {
          label: 'Ingresó al fuero como empleado judicial (2001)',
          url: 'https://www.pjn.gov.ar/registros/empleados (FICTICIO)',
        },
        {
          label: 'Accedió a la secretaría por concurso interno (2009)',
          url: 'https://www.pjn.gov.ar/secretarios/concurso-2009 (FICTICIO)',
        },
        {
          label: 'Concursó para juez — Concurso N° 312 del Consejo de la Magistratura (2017)',
          url: 'https://www.magistratura.gov.ar/concursos/312 (FICTICIO)',
        },
      ],
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
    salaryHistory: [
      {
        grossMonthlyARS: 9_800_000,
        acordada: 'Acordada SCBA N° 5/2023',
        category: 'Juez de Cámara — Poder Judicial Provincia de Buenos Aires',
        validFrom: '2023-01-01',
        validTo: '2023-12-31',
      },
      {
        grossMonthlyARS: 12_400_000,
        acordada: 'Acordada SCBA N° 12/2024',
        category: 'Juez de Cámara — Poder Judicial Provincia de Buenos Aires',
        validFrom: '2024-01-01',
        validTo: null,
      },
    ],
    appointmentDate: '4 de agosto de 2015',
    appointmentBody:
      'Consejo de la Magistratura de la Provincia de Buenos Aires — ' +
      'Decreto Gubernatorial N° 1874/2015 (Gobernación PBA)',
    yearsOnBench: 10,
    publicBio:
      'Abogada con especialización en derecho procesal penal y derechos humanos. ' +
      'Ejerció como Defensora Oficial durante ocho años antes de ingresar al Poder Judicial. ' +
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
    ],
    careerHistory: [
      {
        role: 'Defensora Oficial Adjunta',
        institution: 'Ministerio Público de la Defensa — Depto. Judicial La Plata',
        period: '2001–2009',
      },
      {
        role: 'Jueza de Cámara — Sala II',
        institution: 'Cámara de Apelación y Garantías en lo Penal — La Plata',
        period: '2015–presente',
      },
    ],
    sourceLinks: [
      {
        label: 'SCBA — Consulta de jurisprudencia',
        url: 'https://www.scba.gov.ar/jurisprudencia',
        description: 'Base de jurisprudencia de la Suprema Corte de Buenos Aires.',
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
        'Docente universitaria con carrera judicial propia, pero con aval político explícito del FPV en su designación en Cámara. (FICTICIO)',
      politicalOriginSources: [
        {
          label: 'Docente de derecho penal en UBA y UNLP desde 2001 (FICTICIO)',
          url: 'https://www.derecho.uba.ar/docentes (FICTICIO)',
        },
        {
          label: 'Ingresó al PJ bonaerense como defensora pública (2006) (FICTICIO)',
          url: 'https://www.mpba.gov.ar/defensores (FICTICIO)',
        },
        {
          label: 'Figura en el acta fundacional de Justicia Legítima (2012) (FICTICIO)',
          url: 'https://www.justicia-legitima.org.ar/firmantes (FICTICIO)',
        },
        {
          label: 'Designación impulsada por el bloque FPV — Legislatura de Buenos Aires (FICTICIO)',
          url: 'https://www.hcdiputados-ba.gov.ar/sesiones/2015 (FICTICIO)',
        },
      ],
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
    salaryHistory: [
      {
        grossMonthlyARS: 6_900_000,
        acordada: 'Acordada CSJN N° 3/2023',
        category: 'Juez Federal de Primera Instancia',
        validFrom: '2023-01-01',
        validTo: '2023-12-31',
      },
      {
        grossMonthlyARS: 8_650_000,
        acordada: 'Acordada CSJN N° 7/2024',
        category: 'Juez Federal de Primera Instancia',
        validFrom: '2024-01-01',
        validTo: null,
      },
    ],
    appointmentDate: '22 de septiembre de 2020',
    appointmentBody: 'Consejo de la Magistratura de la Nación — Decreto PEN N° 884/2020',
    yearsOnBench: 5,
    sourceLinks: [
      {
        label: 'PJN — Expedientes Federales de Córdoba',
        url: 'https://www.pjn.gov.ar/judiciales/expedientes',
        description: 'Sistema de gestión judicial. Consulta de causas federales.',
      },
    ],
    associations: [],
    appointmentDetail: {
      politicalOrigin: 'political',
      politicalOriginDetail:
        'Sin trayectoria previa en el Poder Judicial. Abogado privado cuyo pliego fue impulsado por senadores del PJ cordobés. (FICTICIO)',
      politicalOriginSources: [
        {
          label: 'Abogacía privada en Córdoba — sin cargo judicial previo (2005–2020) (FICTICIO)',
          url: 'https://www.colegiodabogados-cba.org.ar/matriculados (FICTICIO)',
        },
        {
          label: 'Pliego impulsado por Sen. Rodríguez Saá y Sen. Corpacci — PJ cordobés (FICTICIO)',
          url: 'https://www.senado.gob.ar/parlamentario/plenarios/2020-08-19 (FICTICIO)',
        },
        {
          label: 'Decreto PEN N° 884/2020 — Designación en Juzgado Federal de Córdoba (FICTICIO)',
          url: 'https://www.boletinoficial.gov.ar/detalleAviso/primera/235678/20200922 (FICTICIO)',
        },
      ],
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
        grossMonthlyARS: salary,
        acordada: `Acordada SCBA N° ${10 + (i % 9)}/2024`,
        category: 'Juez de Garantías — Poder Judicial Provincia de Buenos Aires',
        validFrom: '2024-01-01',
        validTo: null,
      },
    ],
    appointmentDate: `${1 + ((i * 7) % 28)} de ${_gen(_MONTHS, i + 3)} de ${appointYear}`,
    appointmentBody: 'Consejo de la Magistratura de la Provincia de Buenos Aires',
    yearsOnBench: years,
    sourceLinks: [],
  };
});

const BA_CASES: Case[] = BA_PARTIDOS.map(({ name }, i) => {
  const year = 2021 + (i % 4);
  const month = String(1 + (i % 12)).padStart(2, '0');
  const day = String(1 + ((i * 7) % 28)).padStart(2, '0');
  return {
    id: `ba-${i + 1}`,
    judgeId: i + 4,
    expediente: `${10000 + i * 17}/${year}`,
    crime: _gen(_CRIMES, i),
    crimeArticle: `Art. ${79 + (i % 22)} CP`,
    decisionType: _gen(_DECISION_TYPES, i),
    decisionDate: `${year}-${month}-${day}`,
    legalBasis: 'Art. 163 CPPBA — peligro de fuga y entorpecimiento de la investigación',
    outcome: _gen(_OUTCOMES, i),
    outcomeDetail: undefined,
    sourceFile: `${name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')}-exp.pdf`,
  };
});

const MOCK_JUDGES: Judge[] = [...MOCK_JUDGES_BASE, ...BA_JUDGES];

// ── Casos separados del perfil ─────────────────────────────────────────────────
// Migrados desde los perfiles de jueces + casos de seguimiento originales

let caseIdCounter = 1;
function mkId() {
  return `c-${caseIdCounter++}`;
}

const MOCK_CASES: Case[] = [
  // ── Juez 1 ──────────────────────────────────────────────────────────────────
  {
    id: mkId(),
    judgeId: 1,
    expediente: '51234/2022',
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
    id: mkId(),
    judgeId: 1,
    expediente: '49876/2022',
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
    id: mkId(),
    judgeId: 1,
    expediente: '53102/2023',
    crime: 'Lesiones graves dolosas',
    crimeArticle: 'Art. 90 CP',
    decisionType: 'Exención de prisión bajo caución real',
    decisionDate: '2023-03-10',
    legalBasis: 'Art. 316 CPPN — pena máxima del delito inferior a ocho años',
    outcome: 'ongoing',
    outcomeDetail: 'Causa en curso. Debate oral fijado para el segundo semestre de 2025.',
  },
  {
    id: mkId(),
    judgeId: 1,
    expediente: '47851/2021',
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
    id: mkId(),
    judgeId: 1,
    expediente: '55678/2023',
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
    id: mkId(),
    judgeId: 1,
    expediente: '58901/2023',
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
    id: mkId(),
    judgeId: 1,
    expediente: '60432/2024',
    crime: 'Homicidio culposo en siniestro vial',
    crimeArticle: 'Art. 84 bis CP (Ley 27.347)',
    decisionType: 'Exención de prisión bajo caución real',
    decisionDate: '2024-02-19',
    legalBasis: 'Art. 316 CPPN — delito culposo sin antecedentes; domicilio y trabajo acreditados',
    outcome: 'ongoing',
    outcomeDetail: 'Investigación en trámite. Pericia accidentológica pendiente.',
  },
  {
    id: mkId(),
    judgeId: 1,
    expediente: '43210/2021',
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
    id: mkId(),
    judgeId: 1,
    expediente: '52789/2022',
    crime: 'Hurto calificado por uso de llave robada',
    crimeArticle: 'Art. 163 inc. 6 CP',
    decisionType: 'Excarcelación bajo caución personal juratoria',
    decisionDate: '2022-06-01',
    legalBasis: 'Art. 317 CPPN — primer delito; familia a cargo',
    outcome: 'ongoing',
    outcomeDetail: 'Causa en etapa de juicio oral. Fecha de debate pendiente.',
  },
  {
    id: mkId(),
    judgeId: 1,
    expediente: '61789/2024',
    crime: 'Estafa y defraudación reiteradas',
    crimeArticle: 'Art. 172 CP en concurso real (Art. 55 CP)',
    decisionType: 'Exención de prisión bajo caución real',
    decisionDate: '2024-04-08',
    legalBasis: 'Art. 316 CPPN — pena en expectativa no supera seis años; domicilio acreditado',
    outcome: 'fta',
    outcomeDate: '2024-07-03',
    outcomeDetail:
      'El imputado no se constituyó en prisión tras denegarse la apelación. Se libró orden de captura nacional e internacional (Interpol).',
  },

  // ── Jueza 2 ──────────────────────────────────────────────────────────────────
  {
    id: mkId(),
    judgeId: 2,
    expediente: '32145/2021 — Sala II',
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
    id: mkId(),
    judgeId: 2,
    expediente: '29870/2020 — Sala II',
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
    id: mkId(),
    judgeId: 2,
    expediente: '35402/2022 — Sala II',
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
    id: mkId(),
    judgeId: 2,
    expediente: '27634/2019 — Sala II',
    crime: 'Privación ilegítima de la libertad agravada',
    crimeArticle: 'Art. 142 bis, 2° párr. CP',
    decisionType: 'Confirmación de excarcelación bajo caución real',
    decisionDate: '2019-08-15',
    legalBasis: 'Art. 171 CPPPBA — domicilio estable; familia a cargo; trabajo formal acreditado',
    outcome: 'revoked',
    outcomeDate: '2020-01-10',
    outcomeDetail:
      'Libertad revocada por violación de la restricción de acercamiento a la víctima.',
  },
  {
    id: mkId(),
    judgeId: 2,
    expediente: '38711/2023 — Sala II',
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
    id: mkId(),
    judgeId: 2,
    expediente: '40256/2023 — Sala II',
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
    id: mkId(),
    judgeId: 2,
    expediente: '25190/2018 — Sala II',
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
    id: mkId(),
    judgeId: 2,
    expediente: '42980/2024 — Sala II',
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

  // ── Juez 3 ──────────────────────────────────────────────────────────────────
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 11234/2021',
    crime: 'Narcotráfico — transporte de estupefacientes',
    crimeArticle: 'Art. 5 inc. c) Ley 23.737',
    decisionType: 'Excarcelación bajo caución real y arraigo',
    decisionDate: '2021-05-17',
    legalBasis: 'Arts. 210-221 CPPF — primera causa; domicilio fijo; trabajo acreditado',
    outcome: 'fta',
    outcomeDate: '2021-09-04',
    outcomeDetail:
      'No compareció a la audiencia de control de acusación. Se requirió captura nacional e internacional.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 09871/2020',
    crime: 'Lavado de activos provenientes del narcotráfico',
    crimeArticle: 'Art. 303 inc. 1 CP',
    decisionType: 'Exención de prisión bajo caución real y embargo de bienes',
    decisionDate: '2020-12-08',
    legalBasis: 'Art. 210 CPPF — arraigo, bienes embargados superiores al daño estimado',
    outcome: 'revoked',
    outcomeDate: '2021-06-22',
    outcomeDetail:
      'Libertad revocada al detectarse transferencia de fondos al exterior en violación de la prohibición de salida del país.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 13450/2022',
    crime: 'Contrabando agravado de divisas',
    crimeArticle: 'Art. 865 inc. b) Código Aduanero (Ley 22.415)',
    decisionType: 'Excarcelación bajo caución personal juratoria',
    decisionDate: '2022-03-25',
    legalBasis: 'Art. 210 CPPF — monto de la pena en expectativa no excede el umbral de cautelar',
    outcome: 'ongoing',
    outcomeDetail: 'Causa en etapa de juicio. Debate oral fijado para 2025.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 08234/2020',
    crime: 'Asociación ilícita para el narcotráfico (jefatura)',
    crimeArticle: 'Art. 210 bis CP y Art. 7 Ley 23.737',
    decisionType: 'Excarcelación bajo caución real — revocada en apelación',
    decisionDate: '2020-08-14',
    legalBasis: 'Art. 210 CPPF — Cámara Federal revocó por peligro de fuga y entorpecimiento',
    outcome: 'revoked',
    outcomeDate: '2020-10-30',
    outcomeDetail:
      'Cámara Federal de Apelaciones de Córdoba revocó la excarcelación. Imputado reingresó a prisión preventiva.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 15678/2023',
    crime: 'Defraudación al Estado — licitación fraudulenta',
    crimeArticle: 'Art. 174 inc. 5 CP',
    decisionType: 'Exención de prisión bajo caución real',
    decisionDate: '2023-07-19',
    legalBasis: 'Art. 210 CPPF — delito no violento; domicilio fijo; patrimonio embargado',
    outcome: 'ongoing',
    outcomeDetail: 'Investigación en trámite. Peritos contables aún informando.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 10456/2021',
    crime: 'Tráfico de armas de guerra',
    crimeArticle: 'Art. 189 bis inc. 3 CP',
    decisionType: 'Excarcelación bajo caución real',
    decisionDate: '2021-11-02',
    legalBasis: 'Art. 210 CPPF — tiempo de detención excede el mínimo de la pena',
    outcome: 'newArrest',
    outcomeDate: '2022-03-11',
    outcomeDetail: 'Detenido por nueva tenencia ilegal de arma de guerra en Río Cuarto, Córdoba.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 17023/2024',
    crime: 'Ciberdelito — acceso ilegítimo a sistemas informáticos del Estado',
    crimeArticle: 'Art. 153 bis y 197 CP · Ley 26.388',
    decisionType: 'Exención de prisión bajo caución personal juratoria',
    decisionDate: '2024-01-09',
    legalBasis: 'Art. 210 CPPF — primera causa; sin antecedentes; domicilio y trabajo estables',
    outcome: 'ongoing',
    outcomeDetail: 'Investigación en etapa de instrucción. Peritos informáticos designados.',
  },
  {
    id: mkId(),
    judgeId: 3,
    expediente: 'FCB 07891/2019',
    crime: 'Evasión tributaria agravada',
    crimeArticle: 'Art. 2 Ley 24.769 (Régimen Penal Tributario)',
    decisionType: 'Exención de prisión bajo caución real',
    decisionDate: '2019-09-30',
    legalBasis:
      'Art. 316 CPPN (vigente en ese momento) — monto de evasión acreditado; arraigo suficiente',
    outcome: 'fta',
    outcomeDate: '2020-04-17',
    outcomeDetail:
      'El imputado no se presentó al inicio del debate oral. Salió del país con pasaporte no inhabilitado. Orden de captura y alerta Interpol.',
  },
  ...BA_CASES,
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
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function currentSalary(judge: Judge): SalaryRecord | null {
  if (!judge.salaryHistory.length) return null;
  return (
    judge.salaryHistory.find((s) => s.validTo === null) ??
    judge.salaryHistory[judge.salaryHistory.length - 1]
  );
}

function computeStats(judgeId: number): {
  totalReleases: number;
  ftaCount: number;
  newArrestCount: number;
  revokedCount: number;
  totalFailures: number;
  failureRate: number;
} {
  const cases = MOCK_CASES.filter((c) => c.judgeId === judgeId);
  const totalReleases = cases.length;
  const ftaCount = cases.filter((c) => c.outcome === 'fta').length;
  const newArrestCount = cases.filter((c) => c.outcome === 'newArrest').length;
  const revokedCount = cases.filter((c) => c.outcome === 'revoked').length;
  const totalFailures = ftaCount + newArrestCount + revokedCount;
  const failureRate =
    totalReleases > 0 ? parseFloat(((totalFailures / totalReleases) * 100).toFixed(2)) : 0;
  return { totalReleases, ftaCount, newArrestCount, revokedCount, totalFailures, failureRate };
}

function withStats(judge: Judge): JudgeWithStats {
  return { ...judge, salary: currentSalary(judge), ...computeStats(judge.id) };
}

// ── Parámetros de búsqueda ────────────────────────────────────────────────────

export interface FindAllParams {
  page?: number;
  limit?: number;
  province?: string;
  department?: string;
  city?: string;
  search?: string;
  fuero?: string;
  instance?: string;
  scope?: string;
  salaryBand?: 'baja' | 'media' | 'alta';
  yearsBand?: 'junior' | 'mid' | 'senior';
  sortKey?:
    | 'name'
    | 'totalReleases'
    | 'ftaCount'
    | 'newArrestCount'
    | 'revokedCount'
    | 'failureRate';
  sortDir?: 'asc' | 'desc';
}

// ── Servicio ──────────────────────────────────────────────────────────────────

@Injectable()
export class JudgesService {
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

    let all = MOCK_JUDGES.map(withStats);

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

  findAllRaw(): JudgeWithStats[] {
    return MOCK_JUDGES.map(withStats);
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

  findOne(id: number): JudgeWithStats | undefined {
    const j = MOCK_JUDGES.find((j) => j.id === id);
    return j ? withStats(j) : undefined;
  }

  findBySlug(slug: string): JudgeWithStats | undefined {
    const j = MOCK_JUDGES.find((j) => j.slug === slug);
    return j ? withStats(j) : undefined;
  }

  getCasesByJudge(judgeId: number, page = 1, limit = 10): PaginatedResult<Case> {
    const all = MOCK_CASES.filter((c) => c.judgeId === judgeId);
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const safePage = Math.min(Math.max(1, page), totalPages || 1);
    const data = all.slice((safePage - 1) * limit, safePage * limit);
    return { data, total, page: safePage, limit, totalPages };
  }

  /** @deprecated alias para compatibilidad con el endpoint /casos */
  getCasosByJudge(judgeId: number, page = 1, limit = 10) {
    return this.getCasesByJudge(judgeId, page, limit);
  }

  getArchivosByJudge(judgeId: number): ArchivoPublico[] {
    return MOCK_ARCHIVOS.filter((a) => a.judgeId === judgeId);
  }

  getStatsByJudge(judgeId: number) {
    return computeStats(judgeId);
  }

  // ── Mutaciones ───────────────────────────────────────────────────────────────

  importJudge(payload: Omit<Judge, 'id'>): JudgeWithStats {
    const nextId = Math.max(...MOCK_JUDGES.map((j) => j.id), 0) + 1;
    const slug = payload.slug || generateSlug(payload.name, payload.location.province);
    const existing = MOCK_JUDGES.find((j) => j.slug === slug);
    if (existing) return withStats(existing);

    const judge: Judge = {
      ...payload,
      id: nextId,
      slug,
      salaryHistory: payload.salaryHistory ?? [],
    };
    MOCK_JUDGES.push(judge);
    return withStats(judge);
  }

  updateJudge(slug: string, patch: Partial<Omit<Judge, 'id' | 'slug'>>): JudgeWithStats | null {
    const idx = MOCK_JUDGES.findIndex((j) => j.slug === slug);
    if (idx === -1) return null;
    MOCK_JUDGES[idx] = { ...MOCK_JUDGES[idx], ...patch };
    return withStats(MOCK_JUDGES[idx]);
  }

  addSalaryRecord(slug: string, record: SalaryRecord): JudgeWithStats | null {
    const judge = MOCK_JUDGES.find((j) => j.slug === slug);
    if (!judge) return null;
    // Cerrar el período anterior si existe uno abierto
    judge.salaryHistory.forEach((s) => {
      if (!s.validTo) s.validTo = record.validFrom;
    });
    judge.salaryHistory.push(record);
    return withStats(judge);
  }

  addCases(judgeId: number, cases: Omit<Case, 'id' | 'judgeId'>[]): Case[] {
    const judge = MOCK_JUDGES.find((j) => j.id === judgeId);
    if (!judge) return [];
    const added: Case[] = cases.map((c) => ({
      ...c,
      id: mkId(),
      judgeId,
    }));
    MOCK_CASES.push(...added);
    return added;
  }

  removeCase(judgeId: number, caseId: string): boolean {
    const idx = MOCK_CASES.findIndex((c) => c.id === caseId && c.judgeId === judgeId);
    if (idx === -1) return false;
    MOCK_CASES.splice(idx, 1);
    return true;
  }

  removeJudge(id: number): boolean {
    const idx = MOCK_JUDGES.findIndex((j) => j.id === id);
    if (idx === -1) return false;
    MOCK_JUDGES.splice(idx, 1);
    // Eliminar sus casos
    const caseIdxs = MOCK_CASES.reduce<number[]>((acc, c, i) => {
      if (c.judgeId === id) acc.push(i);
      return acc;
    }, []).reverse();
    caseIdxs.forEach((i) => MOCK_CASES.splice(i, 1));
    return true;
  }
}
