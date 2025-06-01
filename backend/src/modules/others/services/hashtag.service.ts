import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateHashtagDto, CreateIfNotExistsHashtagDto, DeleteHashtagDto, GetHashtagDto, QueryHashtagDto, UpdateHashtagDto } from '../dto/hashtag.dto';
import { CreateHashtagCommand } from '../commands/hashtag/create-hashtag.command';
import { UpdateHashtagCommand } from '../commands/hashtag/update-hashtag.command';
import { DeleteHashtagCommand } from '../commands/hashtag/delete-hashtag.command';
import { GetHashtagQuery } from '../queries/hashtag/get-hashtag.query';
import { QueryHashtagsQuery } from '../queries/hashtag/query-hashtags.query';
import { CreateIfNotExistsHashtagCommand } from '../commands/hashtag/create-if-not-exists-hashtag.command';

@Injectable()
export class HashtagService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateHashtagDto, userId: number) {
    return this.commandBus.execute(new CreateHashtagCommand(dto, userId));
  }

  async createIfNotExists(dto: CreateIfNotExistsHashtagDto, userId: number) {
    return this.commandBus.execute(new CreateIfNotExistsHashtagCommand(dto, userId));
  }

  async update(dto: UpdateHashtagDto, userId: number) {
    return this.commandBus.execute(new UpdateHashtagCommand(dto, userId));
  }

  async delete(dto: DeleteHashtagDto, userId: number) {
    return this.commandBus.execute(new DeleteHashtagCommand(dto, userId));
  }

  async getById(dto: GetHashtagDto, userId: number) {
    return this.queryBus.execute(new GetHashtagQuery(dto, userId));
  }

  async query(dto: QueryHashtagDto, userId: number) {
    return this.queryBus.execute(new QueryHashtagsQuery(dto, userId));
  }
}
