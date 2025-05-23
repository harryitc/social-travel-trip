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
    const messageData = new GroupMessage(result.rows[0]);

    try {
      // Get all group members for WebSocket notification
      const memberIds = membersResult.rows.map((m) => m.user_id);

      // Send WebSocket notification to group members
      this.websocketService.notifyGroupMessage(
        dto.group_id,
        memberIds,
        userId,
        messageData,
      );

      this.logger.debug(
        `Sent WebSocket notification for new message in group ${dto.group_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send WebSocket notification for message in group ${dto.group_id}: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return messageData;
  }
}
