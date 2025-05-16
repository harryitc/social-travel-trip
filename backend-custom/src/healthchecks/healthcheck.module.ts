import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import {
  CONNECTION_STRING_DEFAULT,
  CONNECTION_STRING_DEFAULT_MIGRATION,
} from '@configs/databases/postgresql/configuration';
import { DatabaseHealthIndicator } from './database.indicator';
import { ReidisHealthIndicator } from './redis.indicator';
import { SystemHealthIndicator } from './system.indicator';
import { EnvHealthIndicator } from './env.indicator';

@Module({
  imports: [
    TerminusModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT),
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT_MIGRATION),
  ],
  controllers: [HealthController],
  providers: [
    DatabaseHealthIndicator,
    ReidisHealthIndicator,
    SystemHealthIndicator,
    EnvHealthIndicator,
  ],
})
export class HealthcheckModule {}
