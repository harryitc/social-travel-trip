import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import EventEmitter from 'events';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';

import { DATABASE_PROVIDERS, DependencyModule } from '../dependencies';

@Module({
  imports: [
    DependencyModule,
    PostgresModule.forFeature(DATABASE_PROVIDERS),
    CqrsModule,
  ],
  controllers: [],
  providers: [
    EventEmitter,

    // DeteleFileDownload,
  ],
  exports: [],
})
export class OtherModule {}
