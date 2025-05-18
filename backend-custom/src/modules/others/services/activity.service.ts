import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateActivityDto, CreateIfNotExistsActivityDto, DeleteActivityDto, GetActivityDto, QueryActivityDto, UpdateActivityDto } from '../dto/activity.dto';
import { CreateActivityCommand } from '../commands/activity/create-activity.command';
import { UpdateActivityCommand } from '../commands/activity/update-activity.command';
import { DeleteActivityCommand } from '../commands/activity/delete-activity.command';
import { GetActivityQuery } from '../queries/activity/get-activity.query';
import { QueryActivitiesQuery } from '../queries/activity/query-activities.query';
import { CreateIfNotExistsActivityCommand } from '../commands/activity/create-if-not-exists-activity.command';

@Injectable()
export class ActivityService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateActivityDto, userId: number) {
    return this.commandBus.execute(new CreateActivityCommand(dto, userId));
  }

  async createIfNotExists(dto: CreateIfNotExistsActivityDto, userId: number) {
    return this.commandBus.execute(new CreateIfNotExistsActivityCommand(dto, userId));
  }

  async update(dto: UpdateActivityDto, userId: number) {
    return this.commandBus.execute(new UpdateActivityCommand(dto, userId));
  }

  async delete(dto: DeleteActivityDto, userId: number) {
    return this.commandBus.execute(new DeleteActivityCommand(dto, userId));
  }

  async getById(dto: GetActivityDto, userId: number) {
    return this.queryBus.execute(new GetActivityQuery(dto, userId));
  }

  async query(dto: QueryActivityDto, userId: number) {
    return this.queryBus.execute(new QueryActivitiesQuery(dto, userId));
  }
}
