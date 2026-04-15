export interface JudgeLocation {
  country: string;
  province: string;
  /** Departamento Judicial. En CABA es la ciudad entera; en el interior, el depto. judicial oficial. */
  department: string;
}

export interface Judge {
  id: number;
  name: string;
  court: string;
  location: JudgeLocation;
  totalReleases: number;
  ftaCount: number;
  newArrestCount: number;
  revokedCount: number;
}

export interface JudgeWithStats extends Judge {
  totalFailures: number;
  failureRate: number;
}
