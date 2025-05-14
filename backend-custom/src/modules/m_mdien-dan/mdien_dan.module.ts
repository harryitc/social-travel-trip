import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MdienDanController } from './controllers/mdien-dan.controller';
import { MdienDanService } from './services/mdien-dan.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { Repositories } from './repositories';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [MdienDanController],
  providers: [
    MdienDanService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
  ],
})
export class MdienDanModule {}
