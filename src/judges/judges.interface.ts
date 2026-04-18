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

// ── Expediente Reputacional — Fase 1 ─────────────────────────────────────────

/** Asociación o agrupación judicial a la que pertenece el magistrado */
export interface JudgeAssociation {
  /** Nombre de la agrupación. Ej: "Justicia Legítima", "Asociación de Magistrados de la Nación" */
  name: string;
  /** Rol dentro de la asociación. Ej: "Miembro activo", "Referente regional" */
  role?: string;
  /** Año de adhesión o primer registro público de pertenencia */
  since?: number;
  /** URL a fuente pública que acredita la pertenencia */
  sourceUrl?: string;
}

/**
 * Clasificación del origen predominante de la designación.
 * "judicial"  → carrera judicial "pura": secretario → fiscal/defensor → juez
 * "political" → nombramiento con fuerte respaldo político sin trayectoria judicial previa
 * "academic"  → proveniente de la docencia/academia con concurso posterior
 * "mixed"     → trayectoria mixta (carrera + aval político explícito)
 */
export type PoliticalOrigin = 'judicial' | 'political' | 'academic' | 'mixed';

/** Detalle del proceso de designación ante el Consejo de la Magistratura y el Senado */
export interface JudgeAppointmentDetail {
  /** Clasificación del origen de la designación */
  politicalOrigin: PoliticalOrigin;
  /** Descripción textual del contexto de designación */
  politicalOriginDetail?: string;
  /** Puntaje obtenido en el concurso del Consejo de la Magistratura */
  magistraturaScore?: number;
  /** Puesto en el orden de mérito (1 = primero) */
  magistraturaRank?: number;
  /** Identificador del concurso. Ej: "Concurso N° 247" */
  magistraturaCompetitionId?: string;
  /** URL al acta o resolución del concurso */
  magistraturaSourceUrl?: string;
  /** Senadores nacionales que respaldaron el pliego de designación */
  senateBackers?: string[];
  /** Fecha de la sesión del Senado que aprobó el acuerdo */
  senateSession?: string;
  /** URL a la versión taquigráfica de la sesión */
  senateRecordUrl?: string;
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
  // ── Expediente Reputacional — Fase 1 ───────────────────────────────────────
  associations?: JudgeAssociation[];
  appointmentDetail?: JudgeAppointmentDetail;
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
