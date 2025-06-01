import { Module } from '@nestjs/common';
import { MiniBlogController } from './controllers/mini-blog.controller';
import { MiniBlogService } from './services/mini-blog.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { NotifyModule } from '@modules/m_notify/notify.module';
import { UserModule } from '@modules/user/user.module';
import { MiniBlogRepository } from './repositories/mini-blog.repository';
import { UserRelaModule } from '@modules/m_user_rela/user-rela.module';

@Module({
  imports: [
    CqrsModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT),
    NotifyModule, // Import NotifyModule to use event classes
    UserModule, // Import UserModule to get user details
    UserRelaModule, // Import UserRelaModule to get user followers
  ],
  controllers: [MiniBlogController],
  providers: [
    MiniBlogService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
  exports: [MiniBlogService, MiniBlogRepository],
})
export class MiniBlogModule {}
