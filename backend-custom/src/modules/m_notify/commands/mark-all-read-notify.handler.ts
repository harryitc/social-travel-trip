import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { NotifyRepository } from '../repositories/notify.repository';
import { Notification } from '../models/notify.model';
import { MarkAllReadNotifyCommand } from './mark-all-read-notify.command';

/**
 * Handler for marking all notifications as read for a user
 */
@CommandHandler(MarkAllReadNotifyCommand)
export class MarkAllReadNotifyHandler
  implements ICommandHandler<MarkAllReadNotifyCommand>
{
  private readonly logger = new Logger(MarkAllReadNotifyHandler.name);

  constructor(private readonly repository: NotifyRepository) {}

  /**
   * Execute the command to mark all notifications as read
   */
  async execute(command: MarkAllReadNotifyCommand): Promise<any> {
    this.logger.debug(
      `Marking all notifications as read for user ${command.userId}`,
    );

    try {
      // Mark all unread notifications as read for the user
      const result = await this.repository.markAllNotificationsAsRead(command.userId);
      
      return {
        success: true,
        affected: result.rowCount || 0,
      };
    } catch (error) {
      this.logger.error(
        `Error marking all notifications as read: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
