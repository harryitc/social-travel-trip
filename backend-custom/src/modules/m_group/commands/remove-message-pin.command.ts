import {
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { RemoveMessagePinDto } from '../dto/remove-message-pin.dto';

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

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: RemoveMessagePinCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      (member) => member.user_id == userId && member.role == 'admin',
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can unpin messages');
    }

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

    return {
      messageId: dto.group_message_id,
      groupId: dto.group_id,
      action: 'unpinned',
      success: result.rowCount > 0,
    };
  }
}
