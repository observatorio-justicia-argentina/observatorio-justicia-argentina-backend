import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { JudgesService } from './judges.service';

@Controller('judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Get()
  findAll() {
    return this.judgesService.findAll();
  }

  /** Lookup por slug legible. Ej: GET /judges/juan-carlos-perez-gomez-caba */
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    const judge = this.judgesService.findBySlug(slug);
    if (!judge) throw new NotFoundException(`Juez con slug "${slug}" no encontrado`);
    return judge;
  }

  /** Casos paginados por ID numérico interno. Ej: GET /judges/1/casos */
  @Get(':id/casos')
  getCasos(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const judge = this.judgesService.findOne(id);
    if (!judge) throw new NotFoundException(`Juez con id ${id} no encontrado`);
    return this.judgesService.getCasosByJudge(id, Number(page), Number(limit));
  }

  /** Archivos públicos por ID numérico interno. Ej: GET /judges/1/archivos */
  @Get(':id/archivos')
  getArchivos(@Param('id', ParseIntPipe) id: number) {
    const judge = this.judgesService.findOne(id);
    if (!judge) throw new NotFoundException(`Juez con id ${id} no encontrado`);
    return this.judgesService.getArchivosByJudge(id);
  }
}
