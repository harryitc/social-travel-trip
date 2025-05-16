import { ICommand } from '@nestjs/cqrs';
import { ToggleMessagePinDto } from '../dto/toggle-message-pin.dto';

export class ToggleMessagePinCommand implements ICommand {
  constructor(
    public readonly dto: ToggleMessagePinDto,
    public readonly userId: number,
  ) {}
}

export class ToggleMessagePinHandler {
  constructor(
    private readonly messagePinRepository: MessagePinRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(command: ToggleMessagePinCommand) {
    const { dto, userId } = command;
    
    // Verify admin permission
    const member = await this.groupMemberRepository.findOne({
      where: {
        group_id: dto.group_id,
        user_id: userId,
        role: 'admin',
      },
    });

    if (!member) {
      throw new Error('Only admin can pin/unpin messages');
    }

    // Check if pin exists
    const existingPin = await this.messagePinRepository.findOne({
      where: {
        group_message_id: dto.group_message_id,
        group_id: dto.group_id,
      },
    });

    if (existingPin) {
      // Unpin
      await this.messagePinRepository.delete({
        message_pin_id: existingPin.message_pin_id,
      });
      return { pinned: false };
    } else {
      // Pin
      await this.messagePinRepository.create({
        group_message_id: dto.group_message_id,
        group_id: dto.group_id,
        user_id: userId,
        created_at: new Date(),
      });
      return { pinned: true };
    }
  }
}
