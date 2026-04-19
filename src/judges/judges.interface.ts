export interface JudgeLocation {
  country: string;
  province: string;
  department: string;
  city?: string; // partido / localidad dentro del departamento judicial
}

export interface JudgeJurisdiction {
  fuero: string;
  instance: string;
  scope: 'Nacional' | 'Federal' | 'Provincial';
  competence: 'Ordinaria' | 'Federal';
}

/** Un registro salarial vigente en un período. validTo === null significa sueldo actual. */
export interface SalaryRecord {
  grossMonthlyARS: number;
  acordada: string;
  category: string;
  validFrom: string; // ISO date — inicio de vigencia
  validTo: string | null; // null = vigente hoy
}

/** @deprecated Use SalaryRecord */
export type JudgeSalary = SalaryRecord & { lastUpdated: string };

export interface Case {
  id: string;
  judgeId: number;
  expediente: string;
  crime: string;
  crimeArticle: string;
  decisionType: string;
  decisionDate: string;
  legalBasis: string;
  outcome: 'fta' | 'newArrest' | 'revoked' | 'ongoing';
  outcomeDate?: string;
  outcomeDetail?: string;
  sourceFile?: string;
}

export interface JudgeSourceLink {
  label: string;
  url: string;
  description: string;
}

export interface JudgeEducation {
  degree: string;
  institution: string;
  year: number;
}

export interface JudgeCareerEntry {
  role: string;
  institution: string;
  period: string;
}

export interface JudgeNotableDecision {
  year: number;
  description: string;
  article?: string;
  outcome: string;
}

export interface JudgeExtendedStats {
  avgResolutionDays: number;
  pendingCases: number;
  recusals: number;
  appealedDecisions: number;
  reversedOnAppeal: number;
  reversalRate: number;
}

// ── Perfil del juez (sin casos, sin estadísticas — se computan aparte) ─────────

export interface Judge {
  id: number;
  slug: string;
  isDemoData: boolean;
  name: string;
  court: string;
  location: JudgeLocation;
  jurisdiction: JudgeJurisdiction;
  workAddress: string;
  workHours: string;
  salaryHistory: SalaryRecord[];
  appointmentDate: string;
  appointmentBody: string;
  yearsOnBench: number;
  sourceLinks: JudgeSourceLink[];
  publicBio?: string;
  education?: JudgeEducation[];
  careerHistory?: JudgeCareerEntry[];
  notableDecisions?: JudgeNotableDecision[];
  extendedStats?: JudgeExtendedStats;
}

/** Judge + estadísticas computadas desde sus casos + sueldo actual para compat con el frontend */
export interface JudgeWithStats extends Judge {
  salary: SalaryRecord | null; // último registro (validTo === null), o el más reciente
  totalReleases: number;
  ftaCount: number;
  newArrestCount: number;
  revokedCount: number;
  totalFailures: number;
  failureRate: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ResultadoCaso = 'fta' | 'nuevo_arresto' | 'revocada' | 'pendiente';

/** @deprecated alias para compatibilidad — usar Case */
export interface Caso {
  id: string;
  judgeId: number;
  nroExpediente: string;
  fechaInicio: string; // ISO date — cuándo se abrió/denunció la causa
  fechaResolucion?: string; // ISO date — solo si tiene resolución
  tipoMedida: string;
  delito: string; // tipo de causa/delito
  resultado: ResultadoCaso;
  observaciones?: string;
}

// ── Causas cajoneadas ─────────────────────────────────────────────────────────

/**
 * Umbrales basados en la mediana del proceso penal argentino (Procuración General de la Nación):
 * Fuente: https://www.mpf.gob.ar/docs/RepositorioB/Ebooks/qE533.pdf
 *   activa:    < 365 días
 *   demorada:  365–730 días
 *   cajoneada: > 730 días
 *   resuelta:  tiene fechaResolucion
 */
export type EstadoCausa = 'activa' | 'demorada' | 'cajoneada' | 'resuelta';

export interface CausaRanking {
  expediente: string;
  judgeSlug: string;
  judgeName: string;
  provincia: string;
  fuero: string;
  alcance: 'Nacional' | 'Federal' | 'Provincial';
  delito: string;
  fechaInicio: string;
  diasDesdeInicio: number;
  estadoCausa: EstadoCausa;
  tieneResolucion: boolean;
}

export interface CausasFilter {
  estado?: EstadoCausa | 'todas';
  provincia?: string;
  fuero?: string;
  alcance?: 'Nacional' | 'Federal' | 'Provincial';
  delito?: string;
  page?: number;
  limit?: number;
}

export interface ArchivoPublico {
  id: string;
  judgeId: number;
  nombre: string;
  url: string;
  fechaCarga: string;
}
