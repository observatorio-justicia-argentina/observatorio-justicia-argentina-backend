import { Injectable } from '@nestjs/common';
import {
  ArchivoPublico,
  Case,
  Caso,
  CausaRanking,
  CausasFilter,
  EstadoCausa,
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

// ── Mock de causas (formato Caso) para el ranking de causas cajoneadas ────────
// Datos independientes del registro de jueces; usados exclusivamente por
// getCausasRanking y getCausasRankingByJudge.

const MOCK_CASOS: Caso[] = [
  // ── Juez 1: Pérez Gómez (CABA · Criminal y Correccional Nacional) ─────────
  { id: 'co-101', judgeId: 1, nroExpediente: '51234/2022', fechaInicio: '2022-08-14', fechaResolucion: '2022-11-03', tipoMedida: 'Excarcelación bajo caución real', delito: 'Robo con arma de fuego', resultado: 'fta', observaciones: 'El imputado no compareció a la audiencia de indagatoria.' },
  { id: 'co-102', judgeId: 1, nroExpediente: '49876/2022', fechaInicio: '2022-09-22', fechaResolucion: '2023-02-15', tipoMedida: 'Excarcelación bajo caución juratoria', delito: 'Tenencia de estupefacientes con fines de comercialización', resultado: 'nuevo_arresto', observaciones: 'Detenido en flagrancia por robo simple.' },
  { id: 'co-103', judgeId: 1, nroExpediente: '53102/2023', fechaInicio: '2023-03-10', tipoMedida: 'Exención de prisión bajo caución real', delito: 'Lesiones graves dolosas', resultado: 'pendiente' },
  { id: 'co-104', judgeId: 1, nroExpediente: '47851/2021', fechaInicio: '2021-11-05', fechaResolucion: '2022-04-19', tipoMedida: 'Libertad condicional', delito: 'Robo simple reiterado', resultado: 'revocada', observaciones: 'Libertad condicional revocada al ser detenido por nueva causa.' },
  // ── Jueza 2: Gutiérrez Sosa (Buenos Aires · La Matanza · Penal Provincial) ─
  { id: 'co-201', judgeId: 2, nroExpediente: '23456/2022', fechaInicio: '2022-05-18', fechaResolucion: '2022-09-30', tipoMedida: 'Excarcelación', delito: 'Robo agravado', resultado: 'fta' },
  { id: 'co-202', judgeId: 2, nroExpediente: '67890/2022', fechaInicio: '2022-10-03', fechaResolucion: '2023-04-12', tipoMedida: 'Libertad cautelar', delito: 'Hurto calificado', resultado: 'nuevo_arresto' },
  { id: 'co-203', judgeId: 2, nroExpediente: '33210/2023', fechaInicio: '2023-04-20', tipoMedida: 'Prisión preventiva atenuada', delito: 'Estafa procesal', resultado: 'pendiente' },
  // ── Juez 3: Molina Paz (Córdoba · Penal Federal) ──────────────────────────
  { id: 'co-301', judgeId: 3, nroExpediente: '78123/2022', fechaInicio: '2022-01-15', fechaResolucion: '2022-09-05', tipoMedida: 'Excarcelación', delito: 'Narcotráfico', resultado: 'nuevo_arresto', observaciones: 'Detenido por segundo hecho el 22/10/2022 en Palermo.' },
  { id: 'co-302', judgeId: 3, nroExpediente: '90045/2022', fechaInicio: '2022-04-25', fechaResolucion: '2022-11-18', tipoMedida: 'Libertad cautelar', delito: 'Contrabando', resultado: 'fta' },
  { id: 'co-303', judgeId: 3, nroExpediente: '14532/2022', fechaInicio: '2022-09-10', fechaResolucion: '2023-04-07', tipoMedida: 'Libertad bajo caución juratoria', delito: 'Corrupción de funcionario público', resultado: 'revocada', observaciones: 'Revocada por reiteración delictiva comprobada.' },
  { id: 'co-304', judgeId: 3, nroExpediente: '62791/2023', fechaInicio: '2023-03-01', fechaResolucion: '2023-09-30', tipoMedida: 'Prisión preventiva atenuada', delito: 'Lavado de activos', resultado: 'nuevo_arresto' },
  { id: 'co-305', judgeId: 3, nroExpediente: '29841/2025', fechaInicio: '2025-12-05', tipoMedida: 'Excarcelación', delito: 'Defraudación al Estado', resultado: 'pendiente' },
  // ── Jueza 4: Castro Ruiz (CABA · Criminal y Correccional Nacional) ─────────
  { id: 'c-401', judgeId: 4, nroExpediente: '43219/2023', fechaInicio: '2022-12-01', fechaResolucion: '2023-06-14', tipoMedida: 'Libertad cautelar', delito: 'Robo con arma de fuego', resultado: 'fta', observaciones: 'Incomparecencia a audiencia de control del 20/07/2023.' },
  { id: 'c-402', judgeId: 4, nroExpediente: '87654/2021', fechaInicio: '2021-11-10', tipoMedida: 'Excarcelación', delito: 'Daño agravado', resultado: 'pendiente' },
  { id: 'c-403', judgeId: 4, nroExpediente: '55320/2023', fechaInicio: '2023-09-15', fechaResolucion: '2024-04-03', tipoMedida: 'Arresto domiciliario', delito: 'Amenazas', resultado: 'revocada', observaciones: 'Quebrantó condiciones del arresto domiciliario.' },
  // ── Juez 5: Torres Ibáñez (Buenos Aires · La Matanza · Penal Provincial) ───
  { id: 'c-501', judgeId: 5, nroExpediente: '31456/2022', fechaInicio: '2022-05-20', fechaResolucion: '2022-10-11', tipoMedida: 'Excarcelación', delito: 'Robo simple', resultado: 'nuevo_arresto', observaciones: 'Nuevo hecho delictivo el 05/11/2022.' },
  { id: 'c-502', judgeId: 5, nroExpediente: '79023/2022', fechaInicio: '2022-09-01', fechaResolucion: '2023-03-20', tipoMedida: 'Libertad cautelar', delito: 'Hurto', resultado: 'fta' },
  { id: 'c-503', judgeId: 5, nroExpediente: '15678/2023', fechaInicio: '2023-02-14', fechaResolucion: '2023-08-09', tipoMedida: 'Libertad bajo caución real', delito: 'Lesiones leves', resultado: 'revocada' },
  { id: 'c-504', judgeId: 5, nroExpediente: '48921/2024', fechaInicio: '2024-11-08', tipoMedida: 'Prisión preventiva atenuada', delito: 'Violación de domicilio', resultado: 'pendiente' },
  // ── Jueza 6: González Ruiz (Buenos Aires · La Matanza · Penal Provincial) ──
  { id: 'c-601', judgeId: 6, nroExpediente: '22134/2022', fechaInicio: '2022-02-10', fechaResolucion: '2022-08-30', tipoMedida: 'Excarcelación', delito: 'Robo calificado', resultado: 'nuevo_arresto', observaciones: 'Arrestado por robo calificado el 14/09/2022.' },
  { id: 'c-602', judgeId: 6, nroExpediente: '66543/2022', fechaInicio: '2022-06-20', fechaResolucion: '2022-12-15', tipoMedida: 'Libertad cautelar', delito: 'Daño simple', resultado: 'fta', observaciones: 'Sin noticias del imputado desde enero 2023.' },
  { id: 'c-603', judgeId: 6, nroExpediente: '10982/2022', fechaInicio: '2022-11-30', fechaResolucion: '2023-05-04', tipoMedida: 'Libertad bajo caución juratoria', delito: 'Estafa', resultado: 'revocada' },
  { id: 'c-604', judgeId: 6, nroExpediente: '39871/2023', fechaInicio: '2023-08-10', fechaResolucion: '2024-03-28', tipoMedida: 'Arresto domiciliario', delito: 'Homicidio culposo', resultado: 'nuevo_arresto', observaciones: 'Quebrantó el arresto y cometió nuevo delito.' },
  // ── Jueza 7: Pereyra Blanco (Buenos Aires · La Plata · Penal Provincial) ───
  { id: 'c-701', judgeId: 7, nroExpediente: '57831/2022', fechaInicio: '2022-07-05', fechaResolucion: '2023-02-17', tipoMedida: 'Libertad cautelar', delito: 'Abuso sexual', resultado: 'fta', observaciones: 'No compareció al control mensual del 17/03/2023.' },
  { id: 'c-702', judgeId: 7, nroExpediente: '84290/2023', fechaInicio: '2023-03-10', fechaResolucion: '2023-09-22', tipoMedida: 'Excarcelación', delito: 'Lesiones graves', resultado: 'nuevo_arresto' },
  { id: 'c-703', judgeId: 7, nroExpediente: '27654/2023', fechaInicio: '2023-06-20', tipoMedida: 'Prisión preventiva atenuada', delito: 'Narcotráfico (tenencia simple)', resultado: 'pendiente' },
  // ── Juez 8: Méndez Vega (Buenos Aires · La Plata · Penal Federal) ──────────
  { id: 'c-801', judgeId: 8, nroExpediente: '19023/2022', fechaInicio: '2022-10-20', fechaResolucion: '2023-04-14', tipoMedida: 'Excarcelación', delito: 'Peculado', resultado: 'revocada', observaciones: 'Revocada por la Cámara ante reiteración delictiva.' },
  { id: 'c-802', judgeId: 8, nroExpediente: '63410/2023', fechaInicio: '2023-04-05', fechaResolucion: '2023-10-30', tipoMedida: 'Libertad bajo caución real', delito: 'Administración fraudulenta', resultado: 'fta' },
  { id: 'c-803', judgeId: 8, nroExpediente: '41287/2026', fechaInicio: '2026-01-15', tipoMedida: 'Libertad cautelar', delito: 'Soborno', resultado: 'pendiente' },
  // ── Jueza 9: Fernández Ríos (Córdoba · Penal Provincial) ─────────────────
  { id: 'c-901', judgeId: 9, nroExpediente: '72341/2022', fechaInicio: '2022-11-10', fechaResolucion: '2023-05-08', tipoMedida: 'Libertad cautelar', delito: 'Robo en poblado y en banda', resultado: 'fta' },
  { id: 'c-902', judgeId: 9, nroExpediente: '35912/2023', fechaInicio: '2023-05-01', fechaResolucion: '2023-11-14', tipoMedida: 'Excarcelación', delito: 'Tentativa de robo', resultado: 'nuevo_arresto', observaciones: 'Detenido por hecho independiente el 09/12/2023.' },
  { id: 'c-903', judgeId: 9, nroExpediente: '88124/2024', fechaInicio: '2024-08-25', tipoMedida: 'Prisión preventiva atenuada', delito: 'Extorsión', resultado: 'pendiente' },
  // ── Jueza 10: Ramos Prieto (Córdoba · Penal Federal) ─────────────────────
  { id: 'c-1001', judgeId: 10, nroExpediente: '29087/2022', fechaInicio: '2022-12-15', fechaResolucion: '2023-06-19', tipoMedida: 'Libertad bajo caución juratoria', delito: 'Defraudación al Estado', resultado: 'fta', observaciones: 'Incomparecencia sin justificación.' },
  { id: 'c-1002', judgeId: 10, nroExpediente: '51340/2023', fechaInicio: '2023-05-25', fechaResolucion: '2023-12-05', tipoMedida: 'Excarcelación', delito: 'Malversación de caudales públicos', resultado: 'nuevo_arresto' },
  { id: 'c-1003', judgeId: 10, nroExpediente: '17623/2023', fechaInicio: '2023-10-10', tipoMedida: 'Libertad cautelar', delito: 'Encubrimiento agravado', resultado: 'pendiente' },
  // ── Juez 11: Herrera Montoya (Santa Fe · Rosario · Penal Provincial) ───────
  { id: 'c-1101', judgeId: 11, nroExpediente: '84561/2021', fechaInicio: '2021-12-05', fechaResolucion: '2022-07-22', tipoMedida: 'Excarcelación', delito: 'Homicidio doloso', resultado: 'nuevo_arresto', observaciones: 'Nuevo hecho el 08/08/2022 en zona norte de Rosario.' },
  { id: 'c-1102', judgeId: 11, nroExpediente: '43219/2022', fechaInicio: '2022-04-01', fechaResolucion: '2022-11-10', tipoMedida: 'Libertad cautelar', delito: 'Portación ilegal de arma', resultado: 'fta' },
  { id: 'c-1103', judgeId: 11, nroExpediente: '19034/2022', fechaInicio: '2022-09-20', fechaResolucion: '2023-04-25', tipoMedida: 'Libertad bajo caución real', delito: 'Robo con arma blanca', resultado: 'revocada', observaciones: 'La Sala revocó la medida por inconducta procesal reiterada.' },
  { id: 'c-1104', judgeId: 11, nroExpediente: '67821/2023', fechaInicio: '2023-02-05', fechaResolucion: '2023-09-03', tipoMedida: 'Arresto domiciliario', delito: 'Lesiones graves', resultado: 'nuevo_arresto' },
  { id: 'c-1105', judgeId: 11, nroExpediente: '32456/2025', fechaInicio: '2025-11-20', tipoMedida: 'Excarcelación', delito: 'Amenazas con arma', resultado: 'pendiente' },
  // ── Juez 12: Molina Sosa (Santa Fe · Rosario · Penal Federal) ────────────
  { id: 'c-1201', judgeId: 12, nroExpediente: '91230/2022', fechaInicio: '2022-08-25', fechaResolucion: '2023-03-11', tipoMedida: 'Libertad cautelar', delito: 'Narcotráfico', resultado: 'fta', observaciones: 'Incomparecencia a audiencia del 14/04/2023.' },
  { id: 'c-1202', judgeId: 12, nroExpediente: '58743/2023', fechaInicio: '2023-01-20', fechaResolucion: '2023-08-29', tipoMedida: 'Excarcelación', delito: 'Contrabando agravado', resultado: 'nuevo_arresto' },
  { id: 'c-1203', judgeId: 12, nroExpediente: '24891/2024', fechaInicio: '2024-12-10', tipoMedida: 'Arresto domiciliario', delito: 'Lavado de activos', resultado: 'pendiente' },
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
  1: { slug: 'juan-carlos-perez-gomez-caba', name: 'Dr. Juan Carlos Pérez Gómez', provincia: 'CABA', fuero: 'Criminal y Correccional Nacional', alcance: 'Nacional' },
  2: { slug: 'maria-elena-gutierrez-sosa-buenos-aires', name: 'Dra. María Elena Gutiérrez Sosa', provincia: 'Buenos Aires', fuero: 'Penal', alcance: 'Provincial' },
  3: { slug: 'roberto-ernesto-molina-paz-cordoba', name: 'Dr. Roberto Ernesto Molina Paz', provincia: 'Córdoba', fuero: 'Penal Federal', alcance: 'Federal' },
  4: { slug: 'valeria-castro-ruiz-caba', name: 'Dra. Valeria Castro Ruiz', provincia: 'CABA', fuero: 'Criminal y Correccional Nacional', alcance: 'Nacional' },
  5: { slug: 'marcos-torres-ibanez-buenos-aires', name: 'Dr. Marcos Torres Ibáñez', provincia: 'Buenos Aires', fuero: 'Penal', alcance: 'Provincial' },
  6: { slug: 'claudia-gonzalez-ruiz-buenos-aires', name: 'Dra. Claudia González Ruiz', provincia: 'Buenos Aires', fuero: 'Penal', alcance: 'Provincial' },
  7: { slug: 'susana-pereyra-blanco-buenos-aires', name: 'Dra. Susana Pereyra Blanco', provincia: 'Buenos Aires', fuero: 'Penal', alcance: 'Provincial' },
  8: { slug: 'horacio-mendez-vega-buenos-aires', name: 'Dr. Horacio Méndez Vega', provincia: 'Buenos Aires', fuero: 'Penal Federal', alcance: 'Federal' },
  9: { slug: 'patricia-fernandez-rios-cordoba', name: 'Dra. Patricia Fernández Ríos', provincia: 'Córdoba', fuero: 'Penal', alcance: 'Provincial' },
  10: { slug: 'elena-ramos-prieto-cordoba', name: 'Dra. Elena Ramos Prieto', provincia: 'Córdoba', fuero: 'Penal Federal', alcance: 'Federal' },
  11: { slug: 'alejandro-herrera-montoya-santa-fe', name: 'Dr. Alejandro Herrera Montoya', provincia: 'Santa Fe', fuero: 'Penal', alcance: 'Provincial' },
  12: { slug: 'gonzalo-molina-sosa-santa-fe', name: 'Dr. Gonzalo Molina Sosa', provincia: 'Santa Fe', fuero: 'Penal Federal', alcance: 'Federal' },
};

/**
 * Calcula el estado de una causa según días desde inicio y presencia de resolución.
 * Clasificación objetiva por tiempo — no implica juicio sobre la conducta del magistrado.
 * Fuente: https://www.mpf.gob.ar/docs/RepositorioB/Ebooks/qE533.pdf
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
