import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { CreateMiniBlogCommentDTO } from '../dto/create-mini-blog-comment.dto';
import { NotificationEventsService } from '@modules/m_notify/services/notification-events.service';
import { UserService } from '@modules/user/user.service';

export class CreateMiniBlogCommentCommand implements ICommand {
  constructor(
    public readonly data: CreateMiniBlogCommentDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreateMiniBlogCommentCommand)
export class CreateMiniBlogCommentCommandHandler
  implements ICommandHandler<CreateMiniBlogCommentCommand>
{
  private readonly logger = new Logger(CreateMiniBlogCommentCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly notificationService: NotificationEventsService,
    private readonly userService: UserService,
  ) {}

  execute = async (command: CreateMiniBlogCommentCommand): Promise<any> => {
    const { data, user_id } = command;

    // Check if mini blog exists
    const miniBlogResult = await this.repository.getMiniBlogById(
      data.miniBlogId,
    );
    if (!miniBlogResult || miniBlogResult.rowCount === 0) {
      throw new NotFoundException(
        `Mini blog with ID ${data.miniBlogId} not found`,
      );
    }

    // Check if parent comment exists if parentId is provided
    if (data.parentId) {
      const parentCommentResult = await this.repository.getCommentById(
        data.parentId,
      );
      if (!parentCommentResult || parentCommentResult.rowCount === 0) {
        throw new NotFoundException(
          `Parent comment with ID ${data.parentId} not found`,
        );
      }
    }

    // Create comment
    const insertResult = await this.repository.createComment(data, user_id);
    const createdComment = insertResult.rows[0];

    try {
      // Check if this is a reply to another comment
      if (data.parentId) {
        // This is a reply to another comment
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
                createdComment.mini_blog_comment_id,
                user_id,
                replier.full_name || replier.username || 'A user',
              );
            }
          }
        }
      } else {
        // This is a comment on a mini blog
        // We already verified the mini blog exists above
        const miniBlog = miniBlogResult.rows[0];
        const miniBlogOwnerId = miniBlog.user_id;

        // Don't notify if the user is commenting on their own mini blog
        if (miniBlogOwnerId !== user_id) {
          // Get user details for notification
          const commenter = await this.userService.findById(user_id);

          if (commenter) {
            // Notify mini blog owner about the comment
            await this.notificationService.notifyPostComment(
              miniBlogOwnerId,
              data.miniBlogId,
              createdComment.mini_blog_comment_id,
              user_id,
              commenter.full_name || commenter.username || 'A user',
            );
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the comment creation if notification fails
      this.logger.error(
        `Failed to create comment notification: ${error.message}`,
      );
    }

    return Promise.resolve(createdComment);
  };
}
