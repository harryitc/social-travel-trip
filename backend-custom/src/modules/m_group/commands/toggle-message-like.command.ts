import { ICommand } from '@nestjs/cqrs';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';

export class ToggleMessageLikeCommand implements ICommand {
  constructor(
    public readonly dto: ToggleMessageLikeDto,
    public readonly userId: number,
  ) {}
}

export class ToggleMessageLikeHandler {
  constructor(
    private readonly messageLikeRepository: MessageLikeRepository,
  ) {}

  async execute(command: ToggleMessageLikeCommand) {
    const { dto, userId } = command;
    
    // Check if like exists
    const existingLike = await this.messageLikeRepository.findOne({
      where: {
        group_message_id: dto.group_message_id,
        user_id: userId,
      },
    });

    if (existingLike) {
      // Unlike
      await this.messageLikeRepository.delete({
        group_message_id: dto.group_message_id,
        user_id: userId,
      });
      return { liked: false };
    } else {
      // Like
      await this.messageLikeRepository.create({
        group_message_id: dto.group_message_id,
        user_id: userId,
        created_at: new Date(),
        reaction_id: 1,
      });
      return { liked: true };
    }
  }
}
