import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';

import { LogRepository } from './repository/log.repository';
import { LogController } from './log.controller';
import { LogSagas } from './log.sagas';
import { LogService } from './log.service';
import { DependencyModule } from './dependencies';

@Module({
  imports: [
    DependencyModule,
    // ConfigModule.forFeature(AppConfig),
    CqrsModule,
  ],
  controllers: [LogController],
  providers: [
    LogRepository,
    LogService,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    LogSagas,
  ],
  exports: [
    LogService
  ]
})
export class LogModule { }
