import { repl } from '@nestjs/core';
import { PgMigrationConfigPersistentModule } from './config.module';
/**
 * https://docs.nestjs.com/recipes/repl
 * npm run migrate
 */
async function bootstrap() {
  await repl(PgMigrationConfigPersistentModule);
}
bootstrap();
