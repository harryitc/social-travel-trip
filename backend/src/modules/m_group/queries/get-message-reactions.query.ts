import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetMessageReactionsDto } from '../dto/get-message-reactions.dto';
import { NotFoundException, UnauthorizedException } from '@common/exceptions';

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
    const { dto, userId } = query;

    // Check if message exists and get group_id
    const messageExists = await this.repository.checkMessageExists(
      dto.group_message_id,
    );

    if (messageExists.rowCount == 0) {
      throw new NotFoundException('Message not found');
    }

    // Get group_id from message to verify membership
    const messageData = messageExists.rows[0];
    const groupId = messageData.group_id;

    // Verify user is member of the group that contains this message
    const membersResult = await this.repository.getGroupMembers(groupId);
    const member = membersResult.rows.find((m) => m.user_id == userId);

    if (!member) {
      this.logger.warn(
        `User ${userId} attempted to access reactions for message ${dto.group_message_id} without group membership`,
      );
      throw new UnauthorizedException('You are not a member of this group');
    }

    // Get reactions
    const result = await this.repository.getMessageReactions(
      dto.group_message_id,
    );

    // Get users who reacted
    const usersResult = await this.repository.getMessageReactionUsers(
      dto.group_message_id,
    );

    if (result.rowCount == 0) {
      return {
        total: 0,
        reactions: [],
        users: [],
      };
    }

    // Tổng tất cả reaction
    const total = result.rows.reduce((sum, row) => sum + Number(row.count), 0);

    // Format users data
    const users = usersResult.rows.map((row) => ({
      user_id: row.user_id,
      username: row.username,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      reaction_id: row.reaction_id,
      created_at: row.created_at || new Date().toISOString(),
    }));

    return {
      total,
      reactions: result.rows,
      users: users,
      message_id: dto.group_message_id,
    };
  }
}
