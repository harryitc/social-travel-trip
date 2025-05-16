import { Module } from '@nestjs/common';
import { NotifyService } from './services/notify.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { NotifyController } from './controllers/notify.controller';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [NotifyController],
  providers: [
    NotifyService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
})
export class NotifyModule {}
