import { Injectable } from '@nestjs/common';
import { JudgesService } from '../judges/judges.service';
import type { CausasFilter, PaginatedResult, CausaRanking } from '../judges/judges.interface';

@Injectable()
export class CausasService {
  constructor(private readonly judgesService: JudgesService) {}

  getRanking(filter: CausasFilter = {}): PaginatedResult<CausaRanking> {
    return this.judgesService.getCausasRanking(filter);
  }
}
