import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { LikeMiniBlogDTO } from '../dto/like-mini-blog.dto';
import { NotificationEventsService } from '@modules/m_notify/services/notification-events.service';
import { UserService } from '@modules/user/user.service';

export class LikeMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: LikeMiniBlogDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikeMiniBlogCommand)
export class LikeMiniBlogCommandHandler
  implements ICommandHandler<LikeMiniBlogCommand>
{
  private readonly logger = new Logger(LikeMiniBlogCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly notificationService: NotificationEventsService,
    private readonly userService: UserService,
  ) {}

  execute = async (command: LikeMiniBlogCommand): Promise<any> => {
    const { data, userId } = command;

    // Like the mini blog
    const insertResult = await this.repository.likeMiniBlog(data, userId);
    const likeResult = insertResult.rows[0];

    try {
      // Get the mini blog to find the owner
      const miniBlogResult = await this.repository.getMiniBlogById(data.miniBlogId);

      if (miniBlogResult && miniBlogResult.rows && miniBlogResult.rows.length > 0) {
        const miniBlog = miniBlogResult.rows[0];
        const miniBlogOwnerId = miniBlog.user_id;

        // Don't notify if the user is liking their own mini blog
        if (miniBlogOwnerId !== userId) {
          // Get user details for notification
          const liker = await this.userService.findById(userId);

          if (liker) {
            // Notify mini blog owner about the like
            await this.notificationService.notifyPostLike(
              miniBlogOwnerId,
              data.miniBlogId,
              userId,
              liker.full_name || liker.username || 'A user',
            );
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the like operation if notification fails
      this.logger.error(`Failed to create mini blog like notification: ${error.message}`);
    }

    return Promise.resolve(likeResult);
  };
}
