import { IQuery } from '@nestjs/cqrs';

export class GetPinnedMessagesQuery implements IQuery {
  constructor(
    public readonly groupId: number,
    public readonly userId: number,
  ) {}
}

export class GetPinnedMessagesHandler {
  constructor(
    private readonly messagePinRepository: MessagePinRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(command: GetPinnedMessagesQuery) {
    const { groupId, userId } = command;

    // Verify member is in group
    const member = await this.groupMemberRepository.findOne({
      where: {
        group_id: groupId,
        user_id: userId,
      },
    });

    if (!member) {
      throw new Error('User is not a member of this group');
    }

    // Get pinned messages
    return this.messagePinRepository.getPinnedMessages(groupId);
  }
}
