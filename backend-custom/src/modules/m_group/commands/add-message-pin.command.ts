import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { AddMessagePinDto } from '../dto/add-message-pin.dto';
import { MessagePin } from '../models/group.model';

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

  constructor(private readonly repository: GroupRepository) {}

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

    return {
      messageId: dto.group_message_id,
      groupId: dto.group_id,
      action: 'pinned',
      data: pinData,
    };
  }
}
