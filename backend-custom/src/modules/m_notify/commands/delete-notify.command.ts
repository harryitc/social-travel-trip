import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { DeleteNotifyDto } from '../dto/delete-notify.dto';

export class DeleteNotifyCommand implements ICommand {
  constructor(
    public readonly dto: DeleteNotifyDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteNotifyCommand)
export class DeleteNotifyCommandHandler
  implements ICommandHandler<DeleteNotifyCommand>
{
  private readonly logger = new Logger(DeleteNotifyCommand.name);

  constructor(private readonly repository: NotifyRepository) {}

  async execute(command: DeleteNotifyCommand): Promise<any> {
    const { dto } = command;

    // Check if notification exists
    const checkResult = await this.repository.getNotificationById(dto.notify_id);
    if (checkResult.rowCount == 0) {
      throw new NotFoundException(`Notification with ID ${dto.notify_id} not found`);
    }

    // Delete notification
    const result = await this.repository.deleteNotification(dto.notify_id);
    
    if (result.rowCount == 0) {
      throw new Error('Failed to delete notification');
    }
    
    return { success: true, message: 'Notification deleted successfully' };
  }
}
