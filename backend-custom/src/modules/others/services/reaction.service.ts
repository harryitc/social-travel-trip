import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReactionDto, DeleteReactionDto, GetReactionDto, QueryReactionDto, UpdateReactionDto } from '../dto/reaction.dto';
import { CreateReactionCommand } from '../commands/reaction/create-reaction.command';
import { UpdateReactionCommand } from '../commands/reaction/update-reaction.command';
import { DeleteReactionCommand } from '../commands/reaction/delete-reaction.command';
import { GetReactionQuery } from '../queries/reaction/get-reaction.query';
import { QueryReactionsQuery } from '../queries/reaction/query-reactions.query';

@Injectable()
export class ReactionService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateReactionDto, userId: number) {
    return this.commandBus.execute(new CreateReactionCommand(dto, userId));
  }

  async update(dto: UpdateReactionDto, userId: number) {
    return this.commandBus.execute(new UpdateReactionCommand(dto, userId));
  }

  async delete(dto: DeleteReactionDto, userId: number) {
    return this.commandBus.execute(new DeleteReactionCommand(dto, userId));
  }

  async getById(dto: GetReactionDto, userId: number) {
    return this.queryBus.execute(new GetReactionQuery(dto, userId));
  }

  async query(dto: QueryReactionDto, userId: number) {
    return this.queryBus.execute(new QueryReactionsQuery(dto, userId));
  }
}
