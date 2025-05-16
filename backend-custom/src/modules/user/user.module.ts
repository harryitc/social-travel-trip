import { Module } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [UserController],
  providers: [
    UserService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
  exports: [UserService],
})
export class UserModule {}
