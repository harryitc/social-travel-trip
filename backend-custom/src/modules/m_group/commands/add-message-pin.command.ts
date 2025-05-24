import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { AddMessagePinDto } from '../dto/add-message-pin.dto';
import { MessagePin } from '../models/group.model';
import { WebsocketService } from '../../m_websocket/websocket.service';

export class AddMessagePinCommand implements ICommand {
  constructor(
    public readonly dto: AddMessagePinDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(AddMessagePinCommand)
export class AddMessagePinCommandHandler
  implements ICommandHandler<AddMessagePinCommand>
{
  private readonly logger = new Logger(AddMessagePinCommand.name);

  constructor(
    private readonly repository: GroupRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: AddMessagePinCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      (member) => member.user_id == userId && member.role == 'admin',
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can pin messages');
    }

    // Add pin
    const result = await this.repository.addMessagePin(dto, userId);

    // Convert to model
    const pinData = new MessagePin(result.rows[0]);

    try {
      // Get all group members for WebSocket notification
      const memberIds = membersResult.rows.map((m) => m.user_id);

      // Send WebSocket notification to group members
      this.websocketService.notifyGroupMessagePin(
        dto.group_id,
        memberIds,
        dto.group_message_id,
        userId,
        true, // isPinned = true
      );

      this.logger.debug(
        `Sent WebSocket notification for message pin in group ${dto.group_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send WebSocket notification for message pin in group ${dto.group_id}: ${error.message}`,
      );
      // Don't fail the command if WebSocket notification fails
    }

    return {
      messageId: dto.group_message_id,
      groupId: dto.group_id,
      action: 'pinned',
      data: pinData,
    };
  }
}
