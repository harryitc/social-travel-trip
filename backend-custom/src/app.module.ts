import { GlobalConfigurationModule } from '@configs/global-config.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AllErrorLoggingFilter } from '@common/exceptions';
import { LoggingInterceptor, TimeoutInterceptor } from '@common/interceptors';
import { AppLoggerMiddleware } from '@common/middlewares';
import { CustomHeaderMiddleware } from '@common/middlewares/custom-header.middleware';
import { UserMiddleware } from '@common/middlewares/user.middleware';
import { HealthcheckModule } from './healthchecks/healthcheck.module';

import { LogModule } from '@modules/log/log.module';
import { FileV2Module } from '@modules/sys_file-v2/file.module';

import { createClerkClient } from '@clerk/backend';
import { OtherModule } from '@modules/others/other.module';
import { PostModule } from '@modules/posts/post.module';

const CORE_MODULES = [CqrsModule, HealthcheckModule];

const FEATURES_MODULES = [FileV2Module, LogModule, OtherModule, PostModule];

@Module({
  imports: [GlobalConfigurationModule, ...CORE_MODULES, ...FEATURES_MODULES],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllErrorLoggingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    // Chỉ thêm LoggingInterceptor trong chế độ local
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
      useFactory: (conf: ConfigService) =>
        conf.get('appConfig.nodeEnv') === 'local'
          ? new LoggingInterceptor()
          : null,
      inject: [ConfigService],
    },
    {
      provide: 'ClerkClient',
      useFactory: (configService: ConfigService) => {
        return createClerkClient({
          publishableKey: configService.get('CLERK_PUBLISHABLE_KEY'),
          secretKey: configService.get('CLERK_SECRET_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomHeaderMiddleware, AppLoggerMiddleware, UserMiddleware)
      .forRoutes('*');
  }
}
