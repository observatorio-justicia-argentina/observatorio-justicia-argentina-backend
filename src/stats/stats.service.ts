import { Injectable } from '@nestjs/common';
import { JudgesService } from '../judges/judges.service';
import { JurisdictionNode } from './stats.interface';

interface AggregatedStats {
  totalJudges: number;
  totalReleases: number;
  ftaCount: number;
  newArrestCount: number;
  revokedCount: number;
}

function computeNode(
  name: string,
  level: JurisdictionNode['level'],
  path: string,
  stats: AggregatedStats,
  children?: JurisdictionNode[],
): JurisdictionNode {
  const totalFailures = stats.ftaCount + stats.newArrestCount + stats.revokedCount;
  const failureRate =
    stats.totalReleases > 0
      ? parseFloat(((totalFailures / stats.totalReleases) * 100).toFixed(2))
      : 0;
  return {
    name,
    level,
    path,
    ...stats,
    totalFailures,
    failureRate,
    ...(children && children.length > 0 ? { children } : {}),
  };
}

function sumStats(items: AggregatedStats[]): AggregatedStats {
  return items.reduce(
    (acc, cur) => ({
      totalJudges: acc.totalJudges + cur.totalJudges,
      totalReleases: acc.totalReleases + cur.totalReleases,
      ftaCount: acc.ftaCount + cur.ftaCount,
      newArrestCount: acc.newArrestCount + cur.newArrestCount,
      revokedCount: acc.revokedCount + cur.revokedCount,
    }),
    { totalJudges: 0, totalReleases: 0, ftaCount: 0, newArrestCount: 0, revokedCount: 0 },
  );
}

@Injectable()
export class StatsService {
  constructor(private readonly judgesService: JudgesService) {}

  /**
   * Árbol de jurisdicciones (3 niveles):
   *   Argentina → Provincia → Departamento Judicial
   *
   * No hay nivel de barrio: en CABA los juzgados cubren toda la ciudad,
   * y en el interior cada tribunal cubre todo su Departamento Judicial.
   */
  getHierarchy(): JurisdictionNode {
    const judges = this.judgesService.findAllRaw();

    // Agrupar: province → department → jueces
    const tree = new Map<string, Map<string, typeof judges>>();

    for (const judge of judges) {
      const { province, department } = judge.location;

      if (!tree.has(province)) tree.set(province, new Map());
      const provMap = tree.get(province)!;

      if (!provMap.has(department)) provMap.set(department, []);
      provMap.get(department)!.push(judge);
    }

    const provinceNodes: JurisdictionNode[] = [];

    for (const [province, deptMap] of tree) {
      const departmentNodes: JurisdictionNode[] = [];

      for (const [department, judgesInDept] of deptMap) {
        const stats: AggregatedStats = {
          totalJudges: judgesInDept.length,
          totalReleases: judgesInDept.reduce((s, j) => s + j.totalReleases, 0),
          ftaCount: judgesInDept.reduce((s, j) => s + j.ftaCount, 0),
          newArrestCount: judgesInDept.reduce((s, j) => s + j.newArrestCount, 0),
          revokedCount: judgesInDept.reduce((s, j) => s + j.revokedCount, 0),
        };
        departmentNodes.push(
          computeNode(department, 'department', `Argentina/${province}/${department}`, stats),
        );
      }

      const provStats = sumStats(departmentNodes);
      provinceNodes.push(
        computeNode(province, 'province', `Argentina/${province}`, provStats, departmentNodes),
      );
    }

    const countryStats = sumStats(provinceNodes);
    return computeNode('Argentina', 'country', 'Argentina', countryStats, provinceNodes);
  }

  /** Stats agrupadas sólo por provincia (sin hijos) */
  getByProvince(): JurisdictionNode[] {
    const hierarchy = this.getHierarchy();
    return (hierarchy.children ?? []).map(({ children: _c, ...rest }) => rest as JurisdictionNode);
  }
}
