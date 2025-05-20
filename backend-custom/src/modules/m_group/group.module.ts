import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { GroupController } from './controllers/group.controller';
import { NotifyModule } from '@modules/m_notify/notify.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    CqrsModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT),
    NotifyModule, // Import NotifyModule to use event classes
    UserModule, // Import UserModule to get user details
  ],
  controllers: [GroupController],
  providers: [
    GroupService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
})
export class GroupModule {}
