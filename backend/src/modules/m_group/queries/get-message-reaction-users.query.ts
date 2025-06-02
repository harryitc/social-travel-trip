import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetMessageReactionUsersDto } from '../dto/get-message-reaction-users.dto';
import { NotFoundException, UnauthorizedException } from '@common/exceptions';

export class GetMessageReactionUsersQuery implements IQuery {
  constructor(
    public readonly dto: GetMessageReactionUsersDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetMessageReactionUsersQuery)
export class GetMessageReactionUsersQueryHandler
  implements IQueryHandler<GetMessageReactionUsersQuery>
{
  private readonly logger = new Logger(GetMessageReactionUsersQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetMessageReactionUsersQuery): Promise<any> {
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
        `User ${userId} attempted to access reaction users for message ${dto.group_message_id} without group membership`,
      );
      throw new UnauthorizedException('You are not a member of this group');
    }

    // Get users who reacted to the message
    const usersResult = await this.repository.getMessageReactionUsersByType(
      dto.group_message_id,
      dto.reaction_id,
    );

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
      data: users,
      meta: {
        total: usersResult.rowCount || 0,
        message_id: dto.group_message_id,
        reaction_id: dto.reaction_id || null,
      },
    };
  }
}
