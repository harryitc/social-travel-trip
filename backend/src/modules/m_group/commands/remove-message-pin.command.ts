import {
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { RemoveMessagePinDto } from '../dto/remove-message-pin.dto';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class RemoveMessagePinCommand implements ICommand {
  constructor(
    public readonly dto: RemoveMessagePinDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(RemoveMessagePinCommand)
export class RemoveMessagePinCommandHandler
  implements ICommandHandler<RemoveMessagePinCommand>
{
  private readonly logger = new Logger(RemoveMessagePinCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: RemoveMessagePinCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    // const adminMember = membersResult.rows.find(
    //   (member) => member.user_id == userId && member.role == 'admin',
    // );

    // if (!adminMember) {
    //   throw new UnauthorizedException('Only admin can unpin messages');
    // }

    // Check if pin exists
    const pinExists = await this.repository.checkMessagePinExists(
      dto.group_message_id,
      dto.group_id,
    );

    if (pinExists.rowCount == 0) {
      throw new NotFoundException('Message is not pinned');
    }

    // Remove pin
    const result = await this.repository.removeMessagePin(dto);

    try {
      // Get all group members for WebSocket notification
      const memberIds = membersResult.rows.map((m) => m.user_id);

      // Send WebSocket notification to group members
      this.websocketService.notifyGroupMessagePin(
        dto.group_id,
        memberIds,
        dto.group_message_id,
        userId,
        false, // isPinned = false
      );

      this.logger.debug(
        `Sent WebSocket notification for message unpin in group ${dto.group_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send WebSocket notification for message unpin in group ${dto.group_id}: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return {
      messageId: dto.group_message_id,
      groupId: dto.group_id,
      action: 'unpinned',
      success: result.rowCount > 0,
    };
  }
}
