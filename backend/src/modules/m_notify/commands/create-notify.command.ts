import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { CreateNotifyDto } from '../dto/create-notify.dto';
import { Notification } from '../models/notify.model';
import { WebsocketService } from '@modules/m_websocket/websocket.service';

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

  constructor(
    private readonly repository: NotifyRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  async execute(command: CreateNotifyCommand): Promise<any> {
    const { dto, userId } = command;

    // Create notification
    const result = await this.repository.createNotification(dto, userId);

    if (result.rowCount == 0) {
      throw new Error('Failed to create notification');
    }

    const notification = Notification.fromRow(result.rows[0]);

    // Send realtime notification via WebSocket
    try {
      this.logger.debug(`Sending realtime notification to user ${userId}`);
      this.websocketService.notifyUser(userId, notification);
      this.logger.debug(
        `Realtime notification sent successfully to user ${userId}`,
      );
    } catch (wsError) {
      this.logger.error(
        `Failed to send realtime notification to user ${userId}: ${wsError.message}`,
      );
      // Don't throw error here - notification was created successfully in DB
    }

    return notification;
  }
}
