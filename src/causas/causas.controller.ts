import { Controller, Get, Query } from '@nestjs/common';
import { CausasService } from './causas.service';
import type { CausasFilter, EstadoCausa } from '../judges/judges.interface';

@Controller('causas')
export class CausasController {
  constructor(private readonly causasService: CausasService) {}

  /**
   * Ranking global de causas ordenado por diasDesdeInicio DESC.
   *
   * GET /causas
   * GET /causas?estado=cajoneada
   * GET /causas?estado=cajoneada&provincia=CABA&fuero=Penal+Federal
   * GET /causas?delito=narcotráfico&page=2&limit=10
   */
  @Get()
  getRanking(
    @Query('estado') estado?: string,
    @Query('provincia') provincia?: string,
    @Query('fuero') fuero?: string,
    @Query('alcance') alcance?: string,
    @Query('delito') delito?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter: CausasFilter = {
      estado: estado as EstadoCausa | 'todas' | undefined,
      provincia,
      fuero,
      alcance: alcance as 'Nacional' | 'Federal' | 'Provincial' | undefined,
      delito,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    };
    return this.causasService.getRanking(filter);
  }
}
