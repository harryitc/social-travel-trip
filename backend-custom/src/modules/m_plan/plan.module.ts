import { Module } from '@nestjs/common';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';
import { GroupRepository } from '@modules/m_group/repositories/group.repository';

@Module({
  imports: [CqrsModule, PostgresModule.forFeature(CONNECTION_STRING_DEFAULT)],
  controllers: [PlanController],
  providers: [
    PlanService,

    ...QueryHandlers,
    ...CommandHandlers,

    ...Repositories,
    GroupRepository, // Add GroupRepository for membership verification
  ],
})
export class PlanModule {}
