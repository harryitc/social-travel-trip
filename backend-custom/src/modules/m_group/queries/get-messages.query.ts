import { IQuery } from '@nestjs/cqrs';
import { GetMessagesDto } from '../dto/get-messages.dto';

export class GetMessagesQuery implements IQuery {
  constructor(
    public readonly dto: GetMessagesDto,
    public readonly userId: number,
  ) {}
}

export class GetMessagesHandler {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly messageLikeRepository: MessageLikeRepository,
  ) {}

  async execute(command: GetMessagesQuery) {
    const { dto, userId } = command;
    
    // Verify member is in group
    const member = await this.groupMemberRepository.findOne({
      where: {
        group_id: dto.group_id,
        user_id: userId,
      },
    });

    if (!member) {
      throw new Error('User is not a member of this group');
    }

    // Get messages with pagination
    const messages = await this.groupMessageRepository.getMessages(
      dto.group_id,
      dto.page,
      dto.limit,
    );

    // Get likes for these messages
    const messageIds = messages.map(m => m.group_message_id);
    const likes = await this.messageLikeRepository.find({
      where: {
        group_message_id: { $in: messageIds },
      },
    });

    // Add like information to messages
    const messagesWithLikes = messages.map(message => ({
      ...message,
      likes: likes.filter(l => l.group_message_id === message.group_message_id),
      isLiked: likes.some(l => l.group_message_id === message.group_message_id && l.user_id === userId),
    }));

    return messagesWithLikes;
  }
}
