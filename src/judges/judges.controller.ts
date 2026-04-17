import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { JudgesService } from './judges.service';

@Controller('judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Get()
  findAll() {
    return this.judgesService.findAll();
  }

  /** Perfil del juez. Ej: GET /judges/juan-carlos-perez-gomez-caba */
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return judge;
  }

  /** Casos paginados. Ej: GET /judges/juan-carlos-perez-gomez-caba/casos */
  @Get(':slug/casos')
  getCasos(@Param('slug') slug: string, @Query('page') page = '1', @Query('limit') limit = '10') {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getCasosByJudge(judge.id, Number(page), Number(limit));
  }

  /** Archivos públicos. Ej: GET /judges/juan-carlos-perez-gomez-caba/archivos */
  @Get(':slug/archivos')
  getArchivos(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return this.judgesService.getArchivosByJudge(judge.id);
  }
}
