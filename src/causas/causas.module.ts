import { Module } from '@nestjs/common';
import { CausasController } from './causas.controller';
import { CausasService } from './causas.service';
import { JudgesModule } from '../judges/judges.module';

@Module({
  imports: [JudgesModule],
  controllers: [CausasController],
  providers: [CausasService],
})
export class CausasModule {}
