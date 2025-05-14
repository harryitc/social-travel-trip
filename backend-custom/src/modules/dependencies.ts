// Depenencies database lib:
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { UserMock } from '@configs/app/dev-mocks';
import { AppAssetsProvider } from '@configs/assets/app-assets.provider';
// import { IoRedisConfigModule } from '@configs/cache/io-redis/config.module';
import { REDIS_MAIN_PROVIDER } from '@configs/cache/io-redis/configuration';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
// import { QueueRedisConfigModule } from '@configs/queue/redis-queue/config.module';
import { BULL_QUEUE_CONNECTION_KEY } from '@configs/queue/redis-queue/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';

/**
 * If production mode is enabled then guard will check token and policy
 * Else if not production request auto map to mock user.
 */
export const IS_PRODUCTION_MODE = true;
export const DEFAULT_USER_MOCK = UserMock;

// Su dung phan quyen tap trung (request di qua LUA)
export const USE_CENTRALIZE_AUTH =
  process.env.ENABLE_CENTRALIZED_AUTHENTICATION == 'true';

export const DATABASE_PROVIDERS = CONNECTION_STRING_DEFAULT;
export const REDIS_PROVIDER = REDIS_MAIN_PROVIDER;
export const QUEUE_PROVIDER = BULL_QUEUE_CONNECTION_KEY;

export const DEPENDENCIES = [
  CqrsModule,
  PostgresModule.forFeature(DATABASE_PROVIDERS),
  // IoRedisConfigModule,
  // QueueRedisConfigModule,
  ConfigModule,
  HttpModule,
];

@Module({
  imports: DEPENDENCIES,
  providers: [AppAssetsProvider],
  exports: [...DEPENDENCIES, AppAssetsProvider],
})
export class DependencyModule {
  constructor() {}
}
