import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { NotifyModule } from '@modules/m_notify/notify.module';
import { UserModule } from '@modules/user/user.module';
import { UserRelaModule } from '@modules/m_user_rela/user-rela.module';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [
    CqrsModule,
    PostgresModule.forFeature(CONNECTION_STRING_DEFAULT),
    NotifyModule, // Import NotifyModule to use event classes
    UserModule, // Import UserModule to get user details
    UserRelaModule, // Import UserRelaModule to get followers
  ],
  controllers: [PostController],
  providers: [
    PostService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
  exports: [PostService, PostRepository],
})
export class PostModule {}
