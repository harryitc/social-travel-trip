import { GlobalConfigurationModule } from '@configs/global-config.module';
import { PgMigration } from '@libs/persistent/pgmigrations/pgmigrations';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { Module, OnModuleInit } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT_MIGRATION } from '../postgresql/configuration';

@Module({
  imports: [
    GlobalConfigurationModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT_MIGRATION),
  ],
})
export class PgMigrationConfigPersistentModule implements OnModuleInit {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT_MIGRATION)
    public pool: PgSQLConnectionPool,
  ) {}

  async onModuleInit() {
    const migrateExecution = new PgMigration(this.pool);
    await migrateExecution.executeMigrations();
  }
}
