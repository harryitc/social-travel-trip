import { ICommand } from '@nestjs/cqrs';
import { SendMessageDto } from '../dto/send-message.dto';

export class SendMessageCommand implements ICommand {
  constructor(
    public readonly dto: SendMessageDto,
    public readonly userId: number,
  ) {}
}

export class SendMessageHandler {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(command: SendMessageCommand) {
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

    // Create message
    return this.groupMessageRepository.create({
      ...dto,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}
