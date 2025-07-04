import { GlobalConfigurationModule } from '@configs/global-config.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AllErrorLoggingFilter } from '@common/exceptions';
import { LoggingInterceptor, TimeoutInterceptor } from '@common/interceptors';
import { AppLoggerMiddleware } from '@common/middlewares';
import { HealthcheckModule } from './healthchecks/healthcheck.module';

import { LogModule } from '@modules/log/log.module';
import { FileV2Module } from '@modules/sys_file-v2/file.module';

import { OtherModule } from '@modules/others/other.module';
import { PostModule } from '@modules/m_posts/post.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { CommentModule } from '@modules/m_comments/comment.module';
import { GroupModule } from '@modules/m_group/group.module';
import { NotifyModule } from '@modules/m_notify/notify.module';
import { PlanModule } from '@modules/m_plan/plan.module';
import { UserRelaModule } from '@modules/m_user_rela/user-rela.module';
import { MiniBlogModule } from '@modules/m_mini_blog/mini-blog.module';
import { WebsocketModule } from '@modules/m_websocket/websocket.module';

const CORE_MODULES = [CqrsModule, HealthcheckModule];

const FEATURES_MODULES = [
  AuthModule,
  UserModule,
  FileV2Module,
  UserRelaModule,
  PostModule,
  CommentModule,
  GroupModule,
  PlanModule,
  MiniBlogModule,
  NotifyModule,
  LogModule,
  OtherModule,
  WebsocketModule,
];

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
    // {
    //   provide: 'ClerkClient',
    //   useFactory: (configService: ConfigService) => {
    //     return createClerkClient({
    //       publishableKey: configService.get('CLERK_PUBLISHABLE_KEY'),
    //       secretKey: configService.get('CLERK_SECRET_KEY'),
    //     });
    //   },
    //   inject: [ConfigService],
    // },
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // CustomHeaderMiddleware,
        AppLoggerMiddleware,
        // UserMiddleware
      )
      .forRoutes('*');
  }
}
