import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { PortgresqlPersistentConfigModule } from './databases/postgresql/config.module';
import { TypeORMPersistentConfigModule } from './databases/typeorm/config.module';
import {
  ENV_CONFIG_APPLICATION,
  ENV_CONFIG_VALIDATION_SCHEMA_APPLICATION,
} from './app/configuration';

import { POSTGRE_SQL_DB_CONFIG_MAIN } from './databases/postgresql/configuration';
import { ASSETS_PROVIDERS } from './assets/configuration';
import { IoRedisMainConfig } from './cache/io-redis/configuration';
import { AppAssetsProvider } from './assets/app-assets.provider';
// import { QueueRedisConfigModule } from './queue/redis-queue/config.module';
import { RedisQueueEnvConfValSchema } from './queue/redis-queue/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { MssqlPersistentConfigModule } from './databases/mssql/config.module';

// Điền các namespace config vào mảng này để code nhìn gọn hơn - ít đụng phần module bên dưới
// export const APP_CONFIG = registerAs('appConfig', () => ({...});
const CONFIGS = [
  ENV_CONFIG_APPLICATION,
  POSTGRE_SQL_DB_CONFIG_MAIN,
  ASSETS_PROVIDERS,
  IoRedisMainConfig,
];

const VALIDATION_SCHEMAS = {
  ...ENV_CONFIG_VALIDATION_SCHEMA_APPLICATION,
  ...RedisQueueEnvConfValSchema,
};

/**
 * Module tập trung tất cả các config của hệ thống
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      // Đọc biến môi trường NODE_ENV để xác định chế độ môi trường - default local (local.env)
      envFilePath: [`env/${process.env.NODE_ENV || 'local'}.env`],
      load: [...CONFIGS],
      isGlobal: true,
      validationSchema: Joi?.object(VALIDATION_SCHEMAS),
      validationOptions: {
        abortEarly: true, // if true, stops validation on the first error
      },
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return [
          {
            rootPath: join(
              __dirname,
              '../../',
              configService.get<string>('FILE_DIRECTORY_V2'),
            ),
            serveRoot: `/${configService.get<string>('FILE_DIRECTORY_V2')}`,
          },
          {
            rootPath: join(
              __dirname,
              '../../',
              configService.get<string>('FILE_DIRECTORY_V2_ERROR'),
            ),
            serveRoot: `/${configService.get<string>('FILE_DIRECTORY_V2_ERROR')}`,
          },
        ];
      },
    }),
    PortgresqlPersistentConfigModule,
    // MssqlPersistentConfigModule,
    TypeORMPersistentConfigModule,
    // CacheConfigModule,
    // Config memcache,
    // QueueRedisConfigModule,
  ],
  exports: [
    TypeORMPersistentConfigModule,
    PortgresqlPersistentConfigModule,
    // MssqlPersistentConfigModule,
    ConfigModule,
    AppAssetsProvider,
    // QueueRedisConfigModule,
  ],
  providers: [AppAssetsProvider],
  controllers: [],
})
export class GlobalConfigurationModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    Logger.debug(`GlobalConfigurationModule:INIT`);
  }
}
