export interface JudgeLocation {
  country: string;
  province: string;
  /** Departamento Judicial. En CABA es la ciudad entera; en el interior, el depto. judicial oficial. */
  department: string;
}

export interface JudgeJurisdiction {
  /** Fuero al que pertenece el juzgado. Ej: "Criminal y Correccional Nacional" */
  fuero: string;
  /** Instancia judicial. Ej: "Primera instancia", "Cámara de apelaciones" */
  instance: string;
  /**
   * "Nacional"   → Justicia Nacional Ordinaria (CABA, no transferida)
   * "Federal"    → Justicia Federal (aplica en todo el país según competencia)
   * "Provincial" → Justicia provincial ordinaria
   */
  scope: 'Nacional' | 'Federal' | 'Provincial';
  /**
   * "Ordinaria" → delitos del fuero común no federalizados
   * "Federal"   → delitos federales (narcotráfico, contrabando, corrupción, etc.)
   */
  competence: 'Ordinaria' | 'Federal';
}

export interface JudgeSalary {
  grossMonthlyARS: number;
  acordada: string;
  category: string;
  lastUpdated: string;
}

export interface JudgeCase {
  expediente: string;
  defendant: string;
  crime: string;
  crimeArticle: string;
  decisionType: string;
  decisionDate: string;
  legalBasis: string;
  outcome: 'fta' | 'newArrest' | 'revoked' | 'ongoing';
  outcomeDate?: string;
  outcomeDetail?: string;
}

export interface JudgeSourceLink {
  label: string;
  url: string;
  description: string;
}

// ── Campos extendidos (opcionales — disponibles en perfiles completos) ────────

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
  /** Promedio de días desde el inicio de la causa hasta la resolución de libertad */
  avgResolutionDays: number;
  /** Causas activas al momento del relevamiento */
  pendingCases: number;
  /** Cantidad de recusaciones recibidas en la carrera */
  recusals: number;
  /** Resoluciones de libertad apeladas por el Ministerio Público Fiscal */
  appealedDecisions: number;
  /** Resoluciones revocadas por la Cámara tras apelación */
  reversedOnAppeal: number;
  /** Porcentaje de revocación sobre el total de apeladas */
  reversalRate: number;
}

// ── Interfaz principal ────────────────────────────────────────────────────────

export interface Judge {
  id: number;
  isDemoData: boolean;
  name: string;
  court: string;
  location: JudgeLocation;
  jurisdiction: JudgeJurisdiction;
  workAddress: string;
  workHours: string;
  salary: JudgeSalary;
  appointmentDate: string;
  appointmentBody: string;
  yearsOnBench: number;
  totalReleases: number;
  ftaCount: number;
  newArrestCount: number;
  revokedCount: number;
  cases: JudgeCase[];
  sourceLinks: JudgeSourceLink[];
  // ── Campos extendidos (opcionales) ─────────────────────────────────────────
  publicBio?: string;
  education?: JudgeEducation[];
  careerHistory?: JudgeCareerEntry[];
  notableDecisions?: JudgeNotableDecision[];
  extendedStats?: JudgeExtendedStats;
}

export interface JudgeWithStats extends Judge {
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

export interface Caso {
  id: string;
  judgeId: number;
  nroExpediente: string;
  fechaResolucion: string; // ISO date (YYYY-MM-DD)
  tipoMedida: string;
  resultado: ResultadoCaso;
  observaciones?: string;
}

export interface ArchivoPublico {
  id: string;
  judgeId: number;
  nombre: string;
  url: string;
  fechaCarga: string; // ISO date (YYYY-MM-DD)
}
