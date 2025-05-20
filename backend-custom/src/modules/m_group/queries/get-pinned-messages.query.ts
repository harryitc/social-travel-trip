import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GroupMessage } from '../models/group.model';

export class GetPinnedMessagesQuery implements IQuery {
  constructor(
    public readonly groupId: number,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetPinnedMessagesQuery)
export class GetPinnedMessagesQueryHandler
  implements IQueryHandler<GetPinnedMessagesQuery>
{
  private readonly logger = new Logger(GetPinnedMessagesQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetPinnedMessagesQuery): Promise<any> {
    const { groupId } = query;

    // // Verify member is in group
    // const membersResult = await this.repository.getGroupMembers(groupId);
    // const member = membersResult.rows.find((m) => m.user_id == userId);

    // if (!member) {
    //   throw new UnauthorizedException('User is not a member of this group');
    // }

    // Get pinned messages
    const result = await this.repository.getPinnedMessages(groupId);

    if (result.rowCount == 0) {
      throw new NotFoundException('No pinned messages found');
    }

    // Map to model
    const pinnedMessages = result.rows.map(
      (message) => new GroupMessage(message),
    );

    return {
      pinnedMessages,
      total: result.rowCount,
    };
  }
}
