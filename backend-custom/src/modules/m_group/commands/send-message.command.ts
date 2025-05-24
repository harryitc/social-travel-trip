import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { GroupMessage } from '../models/group.model';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class SendMessageCommand implements ICommand {
  constructor(
    public readonly dto: SendMessageDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  private readonly logger = new Logger(SendMessageCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: SendMessageCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify member is in group
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const member = membersResult.rows.find((m) => m.user_id == userId);

    if (!member) {
      throw new UnauthorizedException('User is not a member of this group');
    }

    // Create message
    const result = await this.repository.sendMessage(dto, userId);
    const basicMessageData = new GroupMessage(result.rows[0]);

    try {
      // Get all group members for WebSocket notification
      const memberIds = membersResult.rows.map((m) => m.user_id);

      this.logger.debug(
        `Preparing WebSocket notification for group ${dto.group_id}, members: ${memberIds.join(', ')}, sender: ${userId}`,
      );

      // Fetch complete message with user information for WebSocket
      const enrichedMessageResult = await this.repository.getMessageWithUserInfo(
        basicMessageData.group_message_id,
      );

      if (enrichedMessageResult.rowCount > 0) {
        const enrichedMessageData = new GroupMessage(enrichedMessageResult.rows[0]);

        this.logger.debug(
          `📝 Enriched message data: ${JSON.stringify({
            messageId: enrichedMessageData.group_message_id,
            username: enrichedMessageData.username,
            nickname: enrichedMessageData.nickname,
            avatar_url: enrichedMessageData.avatar_url,
          })}`,
        );

        // Send WebSocket notification to group members with enriched data
        this.websocketService.notifyGroupMessage(
          dto.group_id,
          memberIds,
          userId,
          enrichedMessageData,
        );

        this.logger.debug(
          `✅ Sent WebSocket notification for new message in group ${dto.group_id}`,
        );

        // Return the enriched message data
        return enrichedMessageData;
      } else {
        this.logger.warn(
          `⚠️ Could not fetch enriched message data for message ${basicMessageData.group_message_id}, falling back to basic data`,
        );

        // Fallback to basic message data for WebSocket
        this.websocketService.notifyGroupMessage(
          dto.group_id,
          memberIds,
          userId,
          basicMessageData,
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to send WebSocket notification for message in group ${dto.group_id}: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return basicMessageData;
  }
}
