import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { JudgesModule } from '../judges/judges.module';

@Module({
  imports: [JudgesModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
