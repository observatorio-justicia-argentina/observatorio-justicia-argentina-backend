import { calcularEstadoCausa } from '../judges/judges.service';
import { JudgesService } from '../judges/judges.service';

/**
 * Tests del módulo de causas demoradas.
 * Cubre: calcularEstadoCausa(), getCausasRanking() y getCausasRankingByJudge().
 */

// ── calcularEstadoCausa ───────────────────────────────────────────────────────

describe('calcularEstadoCausa', () => {
  const today = new Date();

  const dateAgo = (days: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  it('devuelve "resuelta" si tieneResolucion es true, independientemente de la fecha', () => {
    expect(calcularEstadoCausa(dateAgo(2000), true)).toBe('resuelta');
  });

  it('devuelve "alta-demora" cuando han pasado más de 730 días sin resolución', () => {
    expect(calcularEstadoCausa(dateAgo(731), false)).toBe('alta-demora');
    expect(calcularEstadoCausa(dateAgo(1200), false)).toBe('alta-demora');
  });

  it('devuelve "demora-moderada" cuando han pasado entre 365 y 730 días (inclusive)', () => {
    expect(calcularEstadoCausa(dateAgo(365), false)).toBe('demora-moderada');
    expect(calcularEstadoCausa(dateAgo(500), false)).toBe('demora-moderada');
    expect(calcularEstadoCausa(dateAgo(730), false)).toBe('demora-moderada');
  });

  it('devuelve "activa" cuando han pasado menos de 365 días sin resolución', () => {
    expect(calcularEstadoCausa(dateAgo(100), false)).toBe('activa');
    expect(calcularEstadoCausa(dateAgo(364), false)).toBe('activa');
  });

  it('el límite exacto de 730 días es "demora-moderada", no "alta-demora"', () => {
    // > 730 = alta-demora; <= 730 = demora-moderada
    expect(calcularEstadoCausa(dateAgo(730), false)).toBe('demora-moderada');
    expect(calcularEstadoCausa(dateAgo(731), false)).toBe('alta-demora');
  });
});

// ── getCausasRanking ──────────────────────────────────────────────────────────

describe('JudgesService.getCausasRanking', () => {
  let service: JudgesService;

  beforeEach(() => {
    service = new JudgesService();
  });

  it('devuelve resultados paginados con los campos requeridos', () => {
    const result = service.getCausasRanking();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('totalPages');
  });

  it('usa page=1 y limit=20 por defecto', () => {
    const result = service.getCausasRanking();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('ordena los resultados por diasDesdeInicio DESC', () => {
    const result = service.getCausasRanking({ limit: 100 });
    for (let i = 1; i < result.data.length; i++) {
      expect(result.data[i - 1].diasDesdeInicio).toBeGreaterThanOrEqual(
        result.data[i].diasDesdeInicio,
      );
    }
  });

  it('filtra correctamente por estado "alta-demora"', () => {
    const result = service.getCausasRanking({ estado: 'alta-demora', limit: 100 });
    result.data.forEach((c) => {
      expect(c.estadoCausa).toBe('alta-demora');
    });
  });

  it('filtra correctamente por estado "demora-moderada"', () => {
    const result = service.getCausasRanking({ estado: 'demora-moderada', limit: 100 });
    result.data.forEach((c) => {
      expect(c.estadoCausa).toBe('demora-moderada');
    });
  });

  it('sin filtro de estado devuelve causas de todos los estados', () => {
    const result = service.getCausasRanking({ limit: 100 });
    const estados = new Set(result.data.map((c) => c.estadoCausa));
    expect(estados.size).toBeGreaterThan(1);
  });

  it('filtra por provincia correctamente', () => {
    const all = service.getCausasRanking({ limit: 100 });
    const provincias = [...new Set(all.data.map((c) => c.provincia))];
    if (provincias.length > 0) {
      const prov = provincias[0];
      const filtered = service.getCausasRanking({ provincia: prov, limit: 100 });
      filtered.data.forEach((c) => {
        expect(c.provincia).toBe(prov);
      });
    }
  });

  it('los filtros son acumulativos (AND)', () => {
    const all = service.getCausasRanking({ limit: 100 });
    const alta = all.data.filter((c) => c.estadoCausa === 'alta-demora');
    if (alta.length > 0) {
      const prov = alta[0].provincia;
      const filtered = service.getCausasRanking({
        estado: 'alta-demora',
        provincia: prov,
        limit: 100,
      });
      filtered.data.forEach((c) => {
        expect(c.estadoCausa).toBe('alta-demora');
        expect(c.provincia).toBe(prov);
      });
    }
  });

  it('respeta la paginación en page 2', () => {
    const page1 = service.getCausasRanking({ page: 1, limit: 5 });
    const page2 = service.getCausasRanking({ page: 2, limit: 5 });
    if (page2.data.length > 0) {
      expect(page1.data[0].expediente).not.toBe(page2.data[0].expediente);
    }
  });

  it('devuelve resultado vacío si no hay causas con el filtro aplicado', () => {
    const result = service.getCausasRanking({ provincia: 'ProvinciaNOEXISTE' });
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('cada causa en el ranking tiene los campos requeridos', () => {
    const result = service.getCausasRanking();
    result.data.forEach((c) => {
      expect(typeof c.expediente).toBe('string');
      expect(typeof c.judgeSlug).toBe('string');
      expect(typeof c.judgeName).toBe('string');
      expect(typeof c.diasDesdeInicio).toBe('number');
      expect(['activa', 'demora-moderada', 'alta-demora', 'resuelta']).toContain(c.estadoCausa);
    });
  });
});

// ── getCausasRankingByJudge ───────────────────────────────────────────────────

describe('JudgesService.getCausasRankingByJudge', () => {
  let service: JudgesService;

  beforeEach(() => {
    service = new JudgesService();
  });

  it('filtra causas solo del juez indicado', () => {
    const all = service.getCausasRanking({ limit: 100 });
    if (all.data.length > 0) {
      const slug = all.data[0].judgeSlug;
      const ranking = service.getCausasRankingByJudge(slug);
      ranking.forEach((c) => {
        expect(c.judgeSlug).toBe(slug);
      });
    }
  });

  it('devuelve array vacío para slug inexistente', () => {
    const result = service.getCausasRankingByJudge('juez-inexistente-xyz');
    expect(result).toHaveLength(0);
  });

  it('ordena por diasDesdeInicio DESC', () => {
    const all = service.getCausasRanking({ limit: 100 });
    if (all.data.length > 0) {
      const slug = all.data[0].judgeSlug;
      const ranking = service.getCausasRankingByJudge(slug);
      for (let i = 1; i < ranking.length; i++) {
        expect(ranking[i - 1].diasDesdeInicio).toBeGreaterThanOrEqual(ranking[i].diasDesdeInicio);
      }
    }
  });
});
