import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
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
}
