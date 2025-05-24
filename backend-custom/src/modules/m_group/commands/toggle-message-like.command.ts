import { Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { MessageLike } from '../models/group.model';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class ToggleMessageLikeCommand implements ICommand {
  constructor(
    public readonly dto: ToggleMessageLikeDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(ToggleMessageLikeCommand)
export class ToggleMessageLikeCommandHandler
  implements ICommandHandler<ToggleMessageLikeCommand>
{
  private readonly logger = new Logger(ToggleMessageLikeCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: ToggleMessageLikeCommand): Promise<any> {
    const { dto, userId } = command;

    // Get message details to find group_id
    const messageResult = await this.repository.getMessageById(dto.group_message_id);
    if (!messageResult.rows.length) {
      throw new NotFoundException('Message not found');
    }

    const message = messageResult.rows[0];
    const groupId = message.group_id;

    // Verify user is a member of the group that contains this message
    const membersResult = await this.repository.getGroupMembers(groupId);
    const member = membersResult.rows.find((m) => m.user_id == userId);

    if (!member) {
      this.logger.warn(`User ${userId} attempted to like/unlike message ${dto.group_message_id} without group membership`);
      throw new UnauthorizedException('You are not a member of this group');
    }

    // Toggle like
    const result = await this.repository.toggleMessageLike(dto, userId);
    const likeData = new MessageLike(result.rows[0]);

    // Determine if this is a like or unlike (reaction_id = 1 means 'no like')
    const isLiked = dto.reaction_id != 1;

    try {
      // Use already fetched group members for WebSocket notification
      const memberIds = membersResult.rows.map((m) => m.user_id);

      // Get updated like count
      const likeCountResult = await this.repository.getMessageLikeCount(dto.group_message_id);
      const likeCount = likeCountResult.rows[0]?.like_count || 0;

      // Send WebSocket notification to group members
      this.websocketService.notifyGroupMessageLike(
        groupId,
        memberIds,
        dto.group_message_id,
        userId,
        isLiked,
        likeCount,
      );

      this.logger.debug(
        `Sent WebSocket notification for message ${isLiked ? 'like' : 'unlike'} in group ${groupId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send WebSocket notification for message like in group ${groupId}: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return {
      messageId: dto.group_message_id,
      data: likeData,
    };
  }
}
