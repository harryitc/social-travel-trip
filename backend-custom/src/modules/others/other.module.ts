import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import EventEmitter from 'events';
import { PostgresModule } from '@libs/persistent/postgresql/postgres.module';

import { DATABASE_PROVIDERS, DependencyModule } from '../dependencies';
import { ProvinceController } from './controllers/province.controller';
import { CityController } from './controllers/city.controller';
import { HashtagController } from './controllers/hashtag.controller';
import { ActivityController } from './controllers/activity.controller';
import { CategoryController } from './controllers/category.controller';
import { ReactionController } from './controllers/reaction.controller';

import { ProvinceService } from './services/province.service';
import { CityService } from './services/city.service';
import { HashtagService } from './services/hashtag.service';
import { ActivityService } from './services/activity.service';
import { CategoryService } from './services/category.service';
import { ReactionService } from './services/reaction.service';

import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Repositories } from './repositories';

@Module({
  imports: [
    DependencyModule,
    PostgresModule.forFeature(DATABASE_PROVIDERS),
    CqrsModule,
  ],
  controllers: [
    ProvinceController,
    CityController,
    HashtagController,
    ActivityController,
    CategoryController,
    ReactionController,
  ],
  providers: [
    EventEmitter,

    // Services
    ProvinceService,
    CityService,
    HashtagService,
    ActivityService,
    CategoryService,
    ReactionService,

    // Command and Query Handlers
    ...CommandHandlers,
    ...QueryHandlers,

    // Repositories
    ...Repositories,
  ],
  exports: [
    ProvinceService,
    CityService,
    HashtagService,
    ActivityService,
    CategoryService,
    ReactionService,
  ],
})
export class OtherModule {}
