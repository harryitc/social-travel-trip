import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { BULL_QUEUE_CONNECTION_KEY, QueueRedisConfig } from './configuration';
import { IO_REDIS_PERFIX } from '../../cache/io-redis/config-keys';

/**
 * @Module({
  imports: [
    // 1 module cos ther dugn nhieu queue voi cung 1 connectoin
    BullModule.registerQueue({
      configKey: BULL_QUEUE_CONNECTION_KEY,
      name: 'queue_name_use_at_module',
    }),

    BullModule.registerQueue({
      configKey: BULL_QUEUE_CONNECTION_KEY,
      name: 'queue_name_use_at_module_1',
    }),
  }) YourFeaturModuleName
 */
@Module({
  imports: [
    BullModule.forRootAsync(BULL_QUEUE_CONNECTION_KEY, {
      imports: [ConfigModule.forFeature(QueueRedisConfig)],
      inject: [QueueRedisConfig.KEY],
      useFactory: (queueConf: ConfigType<typeof QueueRedisConfig>) => {
        return {
          redis: {
            host: queueConf.host,
            port: queueConf.port,
            db: queueConf.db,
            /**
             * Key nay dung de lam prefix cho bull queue dong bo voi key prefix ioredis dung cho project
             */
            keyPrefix: IO_REDIS_PERFIX + 'bull_mq',
          },
        };
      },
    }),


    // Other conneciton to other redis queue
    // BullModule.forRootAsync(BULL_QUEUE_CONNECTION_KEY, {
    //   imports: [ConfigModule.forFeature(QueueRedisConfig)],
    //   inject: [QueueRedisConfig.KEY],
    //   useFactory: (queueConf: ConfigType<typeof QueueRedisConfig>) => {
    //     return {
    //       redis: {
    //         host: queueConf.host,
    //         port: queueConf.port,
    //       },
    //     };
    //   },
    // }),
  ],
  exports: [BullModule],
})
export class QueueRedisConfigModule {}
