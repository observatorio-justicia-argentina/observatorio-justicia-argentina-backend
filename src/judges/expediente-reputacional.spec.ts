import { JudgesService } from './judges.service';

/**
 * Tests del Expediente Reputacional — Fase 1
 * Cubre: associations, appointmentDetail y su integración en findBySlug / findAll.
 */

describe('Expediente Reputacional — Fase 1', () => {
  let service: JudgesService;

  beforeEach(() => {
    service = new JudgesService();
  });

  // ── associations ────────────────────────────────────────────────────────────

  describe('associations', () => {
    it('el juez con origen "judicial" tiene al menos una asociación', () => {
      const judge = service.findBySlug('juan-carlos-perez-gomez-caba');
      expect(judge?.associations).toBeDefined();
      expect(judge!.associations!.length).toBeGreaterThan(0);
    });

    it('cada asociación tiene al menos el campo name', () => {
      const judge = service.findBySlug('juan-carlos-perez-gomez-caba');
      judge!.associations!.forEach((a) => {
        expect(typeof a.name).toBe('string');
        expect(a.name.length).toBeGreaterThan(0);
      });
    });

    it('el juez con origen "mixed" tiene más de una asociación', () => {
      const judge = service.findBySlug('maria-elena-gutierrez-sosa-buenos-aires');
      expect(judge?.associations).toBeDefined();
      expect(judge!.associations!.length).toBeGreaterThan(1);
    });

    it('los campos opcionales de asociación son string o undefined, nunca null', () => {
      const judge = service.findBySlug('juan-carlos-perez-gomez-caba');
      judge!.associations!.forEach((a) => {
        if (a.role !== undefined) expect(typeof a.role).toBe('string');
        if (a.since !== undefined) expect(typeof a.since).toBe('number');
        if (a.sourceUrl !== undefined) expect(typeof a.sourceUrl).toBe('string');
      });
    });
  });

  // ── appointmentDetail ───────────────────────────────────────────────────────

  describe('appointmentDetail', () => {
    it('el juez con origen "judicial" tiene politicalOrigin correcto', () => {
      const judge = service.findBySlug('juan-carlos-perez-gomez-caba');
      expect(judge?.appointmentDetail?.politicalOrigin).toBe('judicial');
    });

    it('el juez con origen "mixed" tiene politicalOrigin correcto', () => {
      const judge = service.findBySlug('maria-elena-gutierrez-sosa-buenos-aires');
      expect(judge?.appointmentDetail?.politicalOrigin).toBe('mixed');
    });

    it('el juez con origen "political" tiene politicalOrigin correcto', () => {
      const judge = service.findBySlug('roberto-ernesto-molina-paz-cordoba');
      expect(judge?.appointmentDetail?.politicalOrigin).toBe('political');
    });

    it('politicalOrigin solo puede ser uno de los 4 valores válidos', () => {
      const validValues = ['judicial', 'political', 'academic', 'mixed'];
      const all = service.findAllRaw();
      all.forEach((j) => {
        if (j.appointmentDetail) {
          expect(validValues).toContain(j.appointmentDetail.politicalOrigin);
        }
      });
    });

    it('magistraturaScore es un número positivo cuando está presente', () => {
      const all = service.findAllRaw();
      all.forEach((j) => {
        if (j.appointmentDetail?.magistraturaScore !== undefined) {
          expect(j.appointmentDetail.magistraturaScore).toBeGreaterThan(0);
        }
      });
    });

    it('magistraturaRank es un entero positivo cuando está presente', () => {
      const all = service.findAllRaw();
      all.forEach((j) => {
        if (j.appointmentDetail?.magistraturaRank !== undefined) {
          expect(j.appointmentDetail.magistraturaRank).toBeGreaterThan(0);
          expect(Number.isInteger(j.appointmentDetail.magistraturaRank)).toBe(true);
        }
      });
    });

    it('senateBackers es un array de strings cuando está presente', () => {
      const all = service.findAllRaw();
      all.forEach((j) => {
        if (j.appointmentDetail?.senateBackers !== undefined) {
          expect(Array.isArray(j.appointmentDetail.senateBackers)).toBe(true);
          j.appointmentDetail.senateBackers.forEach((s) => expect(typeof s).toBe('string'));
        }
      });
    });
  });

  // ── integración con findBySlug ───────────────────────────────────────────────

  describe('integración con findBySlug', () => {
    it('jueces sin expediente reputacional devuelven undefined en associations y appointmentDetail', () => {
      // Busca un juez que no tenga datos de expediente reputacional
      const all = service.findAllRaw();
      const sinDatos = all.find((j) => !j.associations && !j.appointmentDetail);
      if (sinDatos) {
        const found = service.findBySlug(sinDatos.slug);
        expect(found?.associations).toBeUndefined();
        expect(found?.appointmentDetail).toBeUndefined();
      }
    });

    it('findBySlug devuelve undefined para slug inexistente', () => {
      expect(service.findBySlug('juez-que-no-existe')).toBeUndefined();
    });

    it('los campos de expediente reputacional no rompen la estructura de JudgeWithStats', () => {
      const judge = service.findBySlug('juan-carlos-perez-gomez-caba');
      expect(judge).toHaveProperty('id');
      expect(judge).toHaveProperty('slug');
      expect(judge).toHaveProperty('totalReleases');
      expect(judge).toHaveProperty('failureRate');
      // Y también los nuevos campos
      expect(judge).toHaveProperty('associations');
      expect(judge).toHaveProperty('appointmentDetail');
    });
  });
});
