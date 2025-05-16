import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [CommentController],
  providers: [
    CommentService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
})
export class CommentModule {}
