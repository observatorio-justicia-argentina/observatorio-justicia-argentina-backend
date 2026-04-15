import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /** Árbol completo: Argentina › Provincias › Departamentos › Barrios */
  @Get('hierarchy')
  getHierarchy() {
    return this.statsService.getHierarchy();
  }

  /** Stats resumidas por provincia */
  @Get('provinces')
  getByProvince() {
    return this.statsService.getByProvince();
  }
}
