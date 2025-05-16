import { Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { GroupMessage } from '../models/group.model';

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

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: SendMessageCommand): Promise<any> {
    const { dto, userId } = command;

    // Verify member is in group
    const membersResult = await this.repository.getGroupMembers(dto.group_id);
    const member = membersResult.rows.find(m => m.user_id === userId);

    if (!member) {
      throw new UnauthorizedException('User is not a member of this group');
    }

    // Create message
    const result = await this.repository.sendMessage(dto, userId);
    return new GroupMessage(result.rows[0]);
  }
}
