import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { UpdateNotifyDto } from '../dto/update-notify.dto';
import { Notification } from '../models/notify.model';

export class UpdateNotifyCommand implements ICommand {
  constructor(
    public readonly dto: UpdateNotifyDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UpdateNotifyCommand)
export class UpdateNotifyCommandHandler
  implements ICommandHandler<UpdateNotifyCommand>
{
  private readonly logger = new Logger(UpdateNotifyCommand.name);

  constructor(private readonly repository: NotifyRepository) {}

  async execute(command: UpdateNotifyCommand): Promise<any> {
    const { dto, userId } = command;

    // Check if notification exists
    const checkResult = await this.repository.getNotificationById(dto.notify_id);
    if (checkResult.rowCount === 0) {
      throw new NotFoundException(`Notification with ID ${dto.notify_id} not found`);
    }

    // Update notification
    const result = await this.repository.updateNotification(dto, userId);
    
    if (result.rowCount === 0) {
      throw new Error('Failed to update notification');
    }
    
    return Notification.fromRow(result.rows[0]);
  }
}
