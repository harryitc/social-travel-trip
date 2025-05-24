import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { GroupMessage } from '../models/group.model';
import { NotFoundException, UnauthorizedException } from '@common/exceptions';

export class GetMessagesQuery implements IQuery {
  constructor(
    public readonly dto: GetMessagesDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  private readonly logger = new Logger(GetMessagesQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetMessagesQuery): Promise<any> {
    const { dto, userId } = query;

    // Verify member is in group
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const member = membersResult.rows.find((m) => m.user_id == userId);

    if (!member) {
      this.logger.error(
        `❌ [GetMessages] User ${userId} attempted to access messages from group ${dto.group_id} without membership`,
      );
      throw new UnauthorizedException('User is not a member of this group');
    }

    // Check if the group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Get messages with beforeId-based pagination
    const messagesResult = await this.repository.getMessages(dto);

    if (messagesResult.rowCount == 0 && dto.before_id) {
      throw new NotFoundException('No more messages found');
    }

    // Get total count
    const countResult = await this.repository.countMessages(dto.group_id);
    const total = countResult.rows[0].total;

    // Add user's like status to each message and map to model
    const messages = messagesResult.rows.map((message) => {
      const groupMessage = new GroupMessage(message);
      return {
        ...groupMessage,
      };
    });

    // For beforeId-based pagination, hasMore is true if we got the full limit
    // This means there might be more older messages
    const hasMore = messages.length === (dto.limit || 10);

    return {
      messages,
      hasMore,
      total,
    };
  }
}
