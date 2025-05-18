import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { LikeMiniBlogCommentDTO } from '../dto/like-mini-blog.dto';
import { NotificationEventsService } from '@modules/m_notify/services/notification-events.service';
import { UserService } from '@modules/user/user.service';

export class LikeMiniBlogCommentCommand implements ICommand {
  constructor(
    public readonly data: LikeMiniBlogCommentDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikeMiniBlogCommentCommand)
export class LikeMiniBlogCommentCommandHandler
  implements ICommandHandler<LikeMiniBlogCommentCommand>
{
  private readonly logger = new Logger(LikeMiniBlogCommentCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly notificationService: NotificationEventsService,
    private readonly userService: UserService,
  ) {}

  execute = async (command: LikeMiniBlogCommentCommand): Promise<any> => {
    const { data, userId } = command;

    // Like the comment
    const insertResult = await this.repository.likeComment(data, userId);
    const likeResult = insertResult.rows[0];

    try {
      // Get the comment to find the comment owner
      const commentResult = await this.repository.getCommentById(data.commentId);

      if (commentResult && commentResult.rows && commentResult.rows.length > 0) {
        const comment = commentResult.rows[0];
        const commentOwnerId = comment.user_id;
        const miniBlogId = comment.mini_blog_id;

        // Don't notify if the user is liking their own comment
        if (commentOwnerId !== userId) {
          // Get user details for notification
          const liker = await this.userService.findById(userId);

          if (liker) {
            // Notify comment owner about the like
            // We'll use the post_like notification type for simplicity
            await this.notificationService.notifyPostLike(
              commentOwnerId,
              miniBlogId,
              userId,
              liker.full_name || liker.username || 'A user',
            );
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the like operation if notification fails
      this.logger.error(`Failed to create comment like notification: ${error.message}`);
    }

    return Promise.resolve(likeResult);
  };
}
