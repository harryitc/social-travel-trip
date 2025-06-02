import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import EventEmitter from 'events';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';

import { FileService } from './file.service';
import { FileController } from './file.controller';
import { QueryHandlers } from './queries';
import { FileRepository } from './repository/file.repository';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { DATABASE_PROVIDERS, DependencyModule } from '../dependencies';

@Module({
  imports: [
    DependencyModule,
    PostgresModule.forFeature(DATABASE_PROVIDERS),
    CqrsModule,
  ],
  controllers: [FileController],
  providers: [
    EventEmitter,
    FileRepository,
    FileService,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    // DeteleFileDownload,
  ],
  exports: [FileService],
})
export class FileV2Module {}
