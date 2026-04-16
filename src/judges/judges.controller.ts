import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { JudgesService } from './judges.service';

@Controller('judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Get()
  findAll() {
    return this.judgesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const judge = this.judgesService.findOne(id);
    if (!judge) throw new NotFoundException(`Juez con id ${id} no encontrado`);
    return judge;
  }

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

  @Get(':id/archivos')
  getArchivos(@Param('id', ParseIntPipe) id: number) {
    const judge = this.judgesService.findOne(id);
    if (!judge) throw new NotFoundException(`Juez con id ${id} no encontrado`);
    return this.judgesService.getArchivosByJudge(id);
  }
}
