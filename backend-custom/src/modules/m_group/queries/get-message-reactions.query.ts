import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetMessageReactionsDto } from '../dto/get-message-reactions.dto';

export class GetMessageReactionsQuery implements IQuery {
  constructor(
    public readonly dto: GetMessageReactionsDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMessageReactionsQuery)
export class GetMessageReactionsQueryHandler
  implements IQueryHandler<GetMessageReactionsQuery>
{
  private readonly logger = new Logger(GetMessageReactionsQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetMessageReactionsQuery): Promise<any> {
    const { dto } = query;

    // Check if message exists
    const messageExists = await this.repository.checkMessageExists(
      dto.group_message_id,
    );

    if (messageExists.rowCount == 0) {
      throw new NotFoundException('Message not found');
    }

    // Get reactions
    const result = await this.repository.getMessageReactions(
      dto.group_message_id,
    );

    // Get users who reacted
    const usersResult = await this.repository.getMessageReactionUsers(
      dto.group_message_id,
    );

    return {
      message_id: dto.group_message_id,
      reactions: result.rows,
      users: usersResult.rows,
      total: result.rowCount,
    };
  }
}
