import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { GroupController } from './controllers/group.controller';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [GroupController],
  providers: [
    GroupService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
})
export class GroupModule {}
