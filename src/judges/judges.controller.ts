import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { JudgesService } from './judges.service';
import { Case, SalaryRecord } from './judges.interface';

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

  /** Estadísticas computadas. GET /judges/:slug/stats */
  @Get(':slug/stats')
  getStats(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getStatsByJudge(judge.id);
  }

  /** Casos paginados. GET /judges/:slug/casos */
  @Get(':slug/casos')
  getCasos(@Param('slug') slug: string, @Query('page') page = '1', @Query('limit') limit = '10') {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getCasesByJudge(judge.id, Number(page), Number(limit));
  }

  /** Archivos públicos. GET /judges/:slug/archivos */
  @Get(':slug/archivos')
  getArchivos(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getArchivosByJudge(judge.id);
  }

  /** Crear juez (desde scrapper). POST /judges */
  @Post()
  @HttpCode(201)
  importJudge(@Body() body: Record<string, unknown>) {
    return this.judgesService.importJudge(body as any);
  }

  /** Actualizar perfil del juez. PUT /judges/:slug */
  @Put(':slug')
  updateJudge(@Param('slug') slug: string, @Body() body: Record<string, unknown>) {
    const updated = this.judgesService.updateJudge(slug, body as any);
    if (!updated) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return updated;
  }

  /** Agregar registro salarial al historial. POST /judges/:slug/salary */
  @Post(':slug/salary')
  @HttpCode(201)
  addSalaryRecord(@Param('slug') slug: string, @Body() body: SalaryRecord) {
    const updated = this.judgesService.addSalaryRecord(slug, body);
    if (!updated) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return updated;
  }

  /** Agregar casos desde scrapper. POST /judges/:slug/cases */
  @Post(':slug/cases')
  @HttpCode(201)
  addCases(@Param('slug') slug: string, @Body() body: Omit<Case, 'id' | 'judgeId'>[]) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.addCases(judge.id, body);
  }

  /** Eliminar un caso. DELETE /judges/:slug/cases/:caseId */
  @Delete(':slug/cases/:caseId')
  @HttpCode(204)
  removeCase(@Param('slug') slug: string, @Param('caseId') caseId: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    const removed = this.judgesService.removeCase(judge.id, caseId);
    if (!removed) throw new NotFoundException(`Caso con id "${caseId}" no encontrado`);
  }

  /** Eliminar juez completo. DELETE /judges/:id */
  @Delete(':id')
  @HttpCode(204)
  removeJudge(@Param('id') id: string) {
    const removed = this.judgesService.removeJudge(Number(id));
    if (!removed) throw new NotFoundException(`Juez con id ${id} no encontrado`);
  }
}
