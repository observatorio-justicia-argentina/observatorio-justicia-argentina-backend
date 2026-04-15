export type JurisdictionLevel = 'country' | 'province' | 'department';

export interface JurisdictionNode {
  name: string;
  level: JurisdictionLevel;
  /** Ruta completa, ej: "Argentina/Buenos Aires/La Matanza/San Justo" */
  path: string;
  totalJudges: number;
  totalReleases: number;
  ftaCount: number;
  newArrestCount: number;
  revokedCount: number;
  totalFailures: number;
  failureRate: number;
  children?: JurisdictionNode[];
}
