import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { IoRedisMainConfig, REDIS_MAIN_PROVIDER } from './configuration';
import { Redis, RedisOptions } from 'ioredis';
import { IO_REDIS_PERFIX } from './config-keys';

@Module({
  imports: [ConfigModule.forFeature(IoRedisMainConfig)],
  providers: [
    {
      provide: REDIS_MAIN_PROVIDER,
      useFactory: (redisConfig: ConfigType<typeof IoRedisMainConfig>) => {
        const redisConnectOptions: RedisOptions = {
          enableAutoPipelining: true,
          host: redisConfig.host,
          keyPrefix: IO_REDIS_PERFIX,
          port: redisConfig.port,
          db: +redisConfig.name,
        };
        return new Redis(redisConnectOptions);
      },
      inject: [IoRedisMainConfig.KEY],
    },
  ],
  exports: [REDIS_MAIN_PROVIDER],
})
export class IoRedisConfigModule { }