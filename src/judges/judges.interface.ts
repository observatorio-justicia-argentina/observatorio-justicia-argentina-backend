export interface JudgeLocation {
  country: string;
  province: string;
  department: string;
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

/** @deprecated alias para compatibilidad — usar Case */
export interface Caso {
  id: string;
  judgeId: number;
  nroExpediente: string;
  fechaResolucion: string;
  tipoMedida: string;
  resultado: 'fta' | 'nuevo_arresto' | 'revocada' | 'pendiente';
  observaciones?: string;
}

export interface ArchivoPublico {
  id: string;
  judgeId: number;
  nombre: string;
  url: string;
  fechaCarga: string;
}
