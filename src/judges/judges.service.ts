import { Injectable } from '@nestjs/common';
import { Judge, JudgeWithStats } from './judges.interface';

/*
 * Criterio de jurisdicción:
 *  - CABA: un único departamento = "Ciudad Autónoma de Buenos Aires",
 *    porque el PJN (delitos federales y los no transferidos al PJCABA)
 *    tiene competencia sobre toda la ciudad.
 *  - Provincia de Buenos Aires y resto del interior: se usa el
 *    Departamento Judicial oficial (ej. "Depto. Judicial La Matanza").
 *    Los tribunales federales del interior también cubren todo el depto.
 */
const MOCK_JUDGES: Judge[] = [
  // ──── CABA ──────────────────────────────────────────────────────────────
  // Jurisdicción: toda la CABA (PJN + no transferidos)
  {
    id: 1,
    name: 'Dr. Alejandro García Morales',
    court: 'Cámara Federal de Casación Penal',
    location: { country: 'Argentina', province: 'CABA', department: 'Ciudad Autónoma de Buenos Aires' },
    totalReleases: 342,
    ftaCount: 28,
    newArrestCount: 41,
    revokedCount: 15,
  },
  {
    id: 2,
    name: 'Dra. Mariana Vidal Suárez',
    court: 'Tribunal Oral en lo Criminal N° 7',
    location: { country: 'Argentina', province: 'CABA', department: 'Ciudad Autónoma de Buenos Aires' },
    totalReleases: 218,
    ftaCount: 12,
    newArrestCount: 19,
    revokedCount: 8,
  },
  {
    id: 3,
    name: 'Dr. Roberto Espinoza Leal',
    court: 'Juzgado Nacional en lo Criminal y Correccional N° 4',
    location: { country: 'Argentina', province: 'CABA', department: 'Ciudad Autónoma de Buenos Aires' },
    totalReleases: 491,
    ftaCount: 67,
    newArrestCount: 88,
    revokedCount: 34,
  },
  {
    id: 4,
    name: 'Dra. Ana Belén Castro Ruiz',
    court: 'Juzgado Criminal y Correccional Federal N° 2',
    location: { country: 'Argentina', province: 'CABA', department: 'Ciudad Autónoma de Buenos Aires' },
    totalReleases: 156,
    ftaCount: 8,
    newArrestCount: 12,
    revokedCount: 5,
  },
  // ──── Buenos Aires › Depto. Judicial La Matanza ─────────────────────────
  {
    id: 5,
    name: 'Dr. Juan Manuel Torres Ibáñez',
    court: 'Juzgado de Garantías N° 1',
    location: { country: 'Argentina', province: 'Buenos Aires', department: 'Depto. Judicial La Matanza' },
    totalReleases: 287,
    ftaCount: 34,
    newArrestCount: 45,
    revokedCount: 18,
  },
  {
    id: 6,
    name: 'Dra. Patricia González Ruiz',
    court: 'Tribunal Oral en lo Criminal N° 3',
    location: { country: 'Argentina', province: 'Buenos Aires', department: 'Depto. Judicial La Matanza' },
    totalReleases: 312,
    ftaCount: 41,
    newArrestCount: 56,
    revokedCount: 22,
  },
  // ──── Buenos Aires › Depto. Judicial La Plata ───────────────────────────
  {
    id: 7,
    name: 'Dra. Luciana Pereyra Blanco',
    court: 'Juzgado de Garantías N° 3',
    location: { country: 'Argentina', province: 'Buenos Aires', department: 'Depto. Judicial La Plata' },
    totalReleases: 264,
    ftaCount: 18,
    newArrestCount: 24,
    revokedCount: 10,
  },
  {
    id: 8,
    name: 'Dr. Carlos Méndez Vega',
    court: 'Cámara de Apelación y Garantías en lo Penal',
    location: { country: 'Argentina', province: 'Buenos Aires', department: 'Depto. Judicial La Plata' },
    totalReleases: 198,
    ftaCount: 15,
    newArrestCount: 21,
    revokedCount: 9,
  },
  // ──── Córdoba › Depto. Judicial Capital ─────────────────────────────────
  {
    id: 9,
    name: 'Dra. Claudia Fernández Ríos',
    court: 'Tribunal Oral en lo Criminal Federal N° 2',
    location: { country: 'Argentina', province: 'Córdoba', department: 'Depto. Judicial Capital' },
    totalReleases: 176,
    ftaCount: 9,
    newArrestCount: 11,
    revokedCount: 4,
  },
  {
    id: 10,
    name: 'Dra. Sofía Ramos Prieto',
    court: 'Juzgado de Control N° 5',
    location: { country: 'Argentina', province: 'Córdoba', department: 'Depto. Judicial Capital' },
    totalReleases: 223,
    ftaCount: 14,
    newArrestCount: 18,
    revokedCount: 7,
  },
  // ──── Santa Fe › Depto. Judicial Rosario ────────────────────────────────
  {
    id: 11,
    name: 'Dr. Patricio Herrera Montoya',
    court: 'Cámara de Apelaciones en lo Penal',
    location: { country: 'Argentina', province: 'Santa Fe', department: 'Depto. Judicial Rosario' },
    totalReleases: 389,
    ftaCount: 52,
    newArrestCount: 73,
    revokedCount: 29,
  },
  {
    id: 12,
    name: 'Dr. Diego Molina Sosa',
    court: 'Juzgado Penal de Sentencia N° 4',
    location: { country: 'Argentina', province: 'Santa Fe', department: 'Depto. Judicial Rosario' },
    totalReleases: 145,
    ftaCount: 11,
    newArrestCount: 16,
    revokedCount: 6,
  },
];

@Injectable()
export class JudgesService {
  findAll(): JudgeWithStats[] {
    return MOCK_JUDGES.map((judge) => {
      const totalFailures = judge.ftaCount + judge.newArrestCount + judge.revokedCount;
      const failureRate = judge.totalReleases > 0
        ? parseFloat(((totalFailures / judge.totalReleases) * 100).toFixed(2))
        : 0;
      return { ...judge, totalFailures, failureRate };
    });
  }

  findOne(id: number): JudgeWithStats | undefined {
    return this.findAll().find((j) => j.id === id);
  }

  getRawData(): Judge[] {
    return MOCK_JUDGES;
  }
}
