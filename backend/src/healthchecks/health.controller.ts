import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database.indicator';
import {
  CONNECTION_STRING_DEFAULT,
  CONNECTION_STRING_DEFAULT_MIGRATION,
} from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { ReidisHealthIndicator } from './redis.indicator';
import { SystemHealthIndicator } from './system.indicator';
import { EnvHealthIndicator } from './env.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mem: MemoryHealthIndicator,
    private db: DatabaseHealthIndicator,
    private redisIn: ReidisHealthIndicator,
    private sys: SystemHealthIndicator,
    private env: EnvHealthIndicator,

    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly mainDB: PgSQLConnectionPool,
    @PgSQLConnection(CONNECTION_STRING_DEFAULT_MIGRATION)
    private readonly migrations: PgSQLConnectionPool,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.env.isHealth('API_NAME_PREFIX'),
      () => this.env.isHealth('FILE_DIRECTORY_V2_ERROR'),
      () => this.db.isHealthy(CONNECTION_STRING_DEFAULT, this.mainDB),
      () =>
        this.db.isHealthy(CONNECTION_STRING_DEFAULT_MIGRATION, this.migrations),
      // Cache.
      () => this.sys.isHealth(`MEMMORY`, 80), // %
      () =>
        this.http.pingCheck(
          'CONNECTION_TO_EXTERNAL_NETWORK',
          'https://google.com',
        ),
    ]);
  }
}
