import { Module } from '@nestjs/common';
import { MiniBlogController } from './controllers/mini-blog.controller';
import { MiniBlogService } from './services/mini-blog.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [MiniBlogController],
  providers: [
    MiniBlogService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
})
export class MiniBlogModule {}
