import { Module } from '@nestjs/common';
import { JudgesModule } from './judges/judges.module';
import { StatsModule } from './stats/stats.module';
import { ContactsModule } from './contacts/contacts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [JudgesModule, StatsModule, ContactsModule, AuthModule],
})
export class AppModule {}
