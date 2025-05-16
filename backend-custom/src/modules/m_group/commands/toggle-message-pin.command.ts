import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { ToggleMessagePinDto } from '../dto/toggle-message-pin.dto';
import { MessagePin } from '../models/group.model';

export class ToggleMessagePinCommand implements ICommand {
  constructor(
    public readonly dto: ToggleMessagePinDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(ToggleMessagePinCommand)
export class ToggleMessagePinCommandHandler
  implements ICommandHandler<ToggleMessagePinCommand>
{
  private readonly logger = new Logger(ToggleMessagePinCommand.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: ToggleMessagePinCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify admin permission
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const adminMember = membersResult.rows.find(
      member => member.user_id === userId && member.role === 'admin'
    );

    if (!adminMember) {
      throw new UnauthorizedException('Only admin can pin/unpin messages');
    }

    // Toggle pin
    const result = await this.repository.toggleMessagePin(dto, userId);

    // If there's data, convert it to a model
    const pinData = result.result.rows[0] ? new MessagePin(result.result.rows[0]) : null;

    return {
      messageId: dto.group_message_id,
      groupId: dto.group_id,
      action: result.action,
      data: pinData
    };
  }
}
