import { Module } from '@nestjs/common';
import { NotifyService } from './services/notify.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { NotifyController } from './controllers/notify.controller';

import { EventHandlers } from './events';
import { NotifySagas } from './notify.sagas';
import { WebsocketModule } from '@modules/m_websocket/websocket.module';

@Module({
  imports: [
    CqrsModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT),
    WebsocketModule,
  ],
  controllers: [NotifyController],
  providers: [
    NotifyService,
    NotifySagas,

    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ...Repositories,
  ],
  exports: [], // No need to export anything as we're using events
})
export class NotifyModule {}
