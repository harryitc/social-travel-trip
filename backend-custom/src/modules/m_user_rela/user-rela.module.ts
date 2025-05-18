import { Module } from '@nestjs/common';
import { UserRelaController } from './controllers/user-rela.controller';
import { UserRelaService } from './services/user-rela.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { NotifyModule } from '@modules/m_notify/notify.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    CqrsModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT),
    NotifyModule, // Import NotifyModule to use NotificationEventsService
    UserModule, // Import UserModule to get user details
  ],
  controllers: [UserRelaController],
  providers: [
    UserRelaService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
  exports: [
    UserRelaService,
  ]
})
export class UserRelaModule {}
