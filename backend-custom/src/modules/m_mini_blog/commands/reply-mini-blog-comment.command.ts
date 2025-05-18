import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { ReplyMiniBlogCommentDTO } from '../dto/create-mini-blog-comment.dto';
import { NotificationEventsService } from '@modules/m_notify/services/notification-events.service';
import { UserService } from '@modules/user/user.service';

export class ReplyMiniBlogCommentCommand implements ICommand {
  constructor(
    public readonly data: ReplyMiniBlogCommentDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(ReplyMiniBlogCommentCommand)
export class ReplyMiniBlogCommentCommandHandler
  implements ICommandHandler<ReplyMiniBlogCommentCommand>
{
  private readonly logger = new Logger(ReplyMiniBlogCommentCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly notificationService: NotificationEventsService,
    private readonly userService: UserService,
  ) {}

  execute = async (command: ReplyMiniBlogCommentCommand): Promise<any> => {
    const { data, user_id } = command;

    // Create reply
    const insertResult = await this.repository.replyComment(data, user_id);
    const createdReply = insertResult.rows[0];

    try {
      // Get the parent comment to find its owner
      const parentCommentResult = await this.repository.getCommentById(
        data.parentId,
      );

      if (
        parentCommentResult &&
        parentCommentResult.rows &&
        parentCommentResult.rows.length > 0
      ) {
        const parentComment = parentCommentResult.rows[0];
        const commentOwnerId = parentComment.user_id;

        // Don't notify if the user is replying to their own comment
        if (commentOwnerId !== user_id) {
          // Get user details for notification
          const replier = await this.userService.findById(user_id);

          if (replier) {
            // Notify comment owner about the reply
            await this.notificationService.notifyCommentReply(
              commentOwnerId,
              data.miniBlogId,
              data.parentId,
              createdReply.mini_blog_comment_id,
              user_id,
              replier.full_name || replier.username || 'A user',
            );
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the reply creation if notification fails
      this.logger.error(`Failed to create reply notification: ${error.message}`);
    }

    return Promise.resolve(createdReply);
  };
}
