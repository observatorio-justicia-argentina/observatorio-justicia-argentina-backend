import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { JudgesService } from './judges.service';

@Controller('judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Get('counts')
  getCounts() {
    return this.judgesService.getLocationCounts();
  }

  @Get('options')
  getOptions() {
    return this.judgesService.getFilterOptions();
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '9',
    @Query('province') province?: string,
    @Query('department') department?: string,
    @Query('city') city?: string,
    @Query('search') search?: string,
    @Query('fuero') fuero?: string,
    @Query('instance') instance?: string,
    @Query('scope') scope?: string,
    @Query('salaryBand') salaryBand?: string,
    @Query('yearsBand') yearsBand?: string,
    @Query('sortKey') sortKey?: string,
    @Query('sortDir') sortDir?: string,
  ) {
    return this.judgesService.findAll({
      page: Number(page),
      limit: Number(limit),
      province: province || undefined,
      department: department || undefined,
      city: city || undefined,
      search: search || undefined,
      fuero: fuero || undefined,
      instance: instance || undefined,
      scope: scope || undefined,
      salaryBand: salaryBand as any,
      yearsBand: yearsBand as any,
      sortKey: sortKey as any,
      sortDir: sortDir as any,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return judge;
  }

  @Get(':slug/stats')
  getStats(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getStatsByJudge(judge.id);
  }

  @Get(':slug/casos')
  getCasos(@Param('slug') slug: string, @Query('page') page = '1', @Query('limit') limit = '10') {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getCasosByJudge(judge.id, Number(page), Number(limit));
  }

  @Get(':slug/archivos')
  getArchivos(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getArchivosByJudge(judge.id);
  }

  @Get(':slug/causas-ranking')
  getCausasRanking(@Param('slug') slug: string) {
    return this.judgesService.getCausasRankingByJudge(slug);
  }

  /**
   * Ranking de causas por tiempo de demora, filtrado al juez.
   * Ej: GET /judges/juan-carlos-perez-gomez-caba/causas-ranking
   */
  @Get(':slug/causas-ranking')
  getCausasRanking(@Param('slug') slug: string) {
    return this.judgesService.getCausasRankingByJudge(slug);
  }
}
