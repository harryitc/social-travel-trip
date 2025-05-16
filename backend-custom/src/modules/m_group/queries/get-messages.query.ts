import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { GroupMessage } from '../models/group.model';

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
    // const membersResult = await this.repository.getGroupMembers(dto.group_id);
    // const member = membersResult.rows.find((m) => m.user_id == userId);

    // if (!member) {
    //   throw new UnauthorizedException('User is not a member of this group');
    // }

    // Check if the group exists
    const groupResult = await this.repository.getGroupById(dto.group_id);
    if (groupResult.rowCount == 0) {
      throw new NotFoundException(`Group with ID ${dto.group_id} not found`);
    }

    // Get messages with pagination
    const messagesResult = await this.repository.getMessages(dto);

    if (messagesResult.rowCount == 0 && dto.page > 1) {
      throw new NotFoundException('No more messages found');
    }

    // Get total count
    const countResult = await this.repository.countMessages(dto.group_id);
    const total = parseInt(countResult.rows[0].total, 10);

    // Add user's like status to each message and map to model
    const messages = messagesResult.rows.map((message) => {
      // Check if the current user has liked this message
      const isLikedByUser =
        message.like_count > 0 &&
        this.repository
          .getMessageLikes(message.group_message_id)
          .then((result) => result.rows.some((like) => like.user_id == userId));

      const groupMessage = new GroupMessage(message);
      return {
        ...groupMessage,
        isLikedByUser,
      };
    });

    return {
      messages,
      pagination: {
        total,
        page: dto.page || 1,
        limit: dto.limit || 10,
        hasMore: (dto.page || 1) * (dto.limit || 10) < total,
      },
    };
  }
}
