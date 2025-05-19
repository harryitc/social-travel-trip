import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { CreateNotifyDto } from '../dto/create-notify.dto';
import { Notification } from '../models/notify.model';

export class CreateNotifyCommand implements ICommand {
  constructor(
    public readonly dto: CreateNotifyDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateNotifyCommand)
export class CreateNotifyCommandHandler
  implements ICommandHandler<CreateNotifyCommand>
{
  private readonly logger = new Logger(CreateNotifyCommand.name);

  constructor(private readonly repository: NotifyRepository) {}

  async execute(command: CreateNotifyCommand): Promise<any> {
    const { dto, userId } = command;

    // Create notification
    const result = await this.repository.createNotification(dto, userId);
    
    if (result.rowCount == 0) {
      throw new Error('Failed to create notification');
    }
    
    return Notification.fromRow(result.rows[0]);
  }
}
