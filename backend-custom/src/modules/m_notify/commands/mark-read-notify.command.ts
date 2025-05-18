import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { MarkReadNotifyDto } from '../dto/mark-read-notify.dto';
import { Notification } from '../models/notify.model';

export class MarkReadNotifyCommand implements ICommand {
  constructor(
    public readonly dto: MarkReadNotifyDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(MarkReadNotifyCommand)
export class MarkReadNotifyCommandHandler
  implements ICommandHandler<MarkReadNotifyCommand>
{
  private readonly logger = new Logger(MarkReadNotifyCommand.name);

  constructor(private readonly repository: NotifyRepository) {}

  async execute(command: MarkReadNotifyCommand): Promise<any> {
    const { dto, userId } = command;

    // Check if notification exists
    const checkResult = await this.repository.getNotificationById(dto.notify_id);
    if (checkResult.rowCount === 0) {
      throw new NotFoundException(`Notification with ID ${dto.notify_id} not found`);
    }

    // Mark notification as read
    const result = await this.repository.markNotificationAsRead(dto.notify_id, userId);
    
    if (result.rowCount === 0) {
      throw new Error('Failed to mark notification as read');
    }
    
    return Notification.fromRow(result.rows[0]);
  }
}
