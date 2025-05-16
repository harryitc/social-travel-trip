import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { MessageLike } from '../models/group.model';

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

  constructor(private readonly repository: GroupRepository) {}

  async execute(command: ToggleMessageLikeCommand): Promise<any> {
    const { dto, userId } = command;

    // Toggle like
    const result = await this.repository.toggleMessageLike(dto, userId);

    // If there's data, convert it to a model
    const likeData = result.result.rows[0]
      ? new MessageLike(result.result.rows[0])
      : null;

    return {
      messageId: dto.group_message_id,
      action: result.action,
      data: likeData,
    };
  }
}
