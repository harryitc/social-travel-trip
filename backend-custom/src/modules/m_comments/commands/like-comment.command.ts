import { Logger } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { CommentRepository } from '../repositories/comment.repository';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { UserService } from '@modules/user/user.service';
import { PostLikeEvent } from '@modules/m_notify/events/post-like.event';

export class LikeCommentCommand implements ICommand {
  constructor(
    public readonly data: LikeCommentDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentCommandHandler
  implements ICommandHandler<LikeCommentCommand>
{
  private readonly logger = new Logger(LikeCommentCommand.name);

  constructor(
    private readonly repository: CommentRepository,
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
  ) {}

  execute = async (command: LikeCommentCommand): Promise<any> => {
    const { data, userId } = command;

    // Like the comment
    const insertResult = await this.repository.likeComment(data, userId);
    const likeResult = insertResult.rows[0];

    try {
      // Get the comment to find the comment owner
      const commentResult = await this.repository.getCommentById(
        data.commentId,
      );

      if (
        commentResult &&
        commentResult.rows &&
        commentResult.rows.length > 0
      ) {
        const comment = commentResult.rows[0];
        const commentOwnerId = comment.user_id;
        const postId = comment.post_id;

        // Don't notify if the user is liking their own comment
        if (commentOwnerId !== userId) {
          // Get user details for notification
          const liker = await this.userService.findById(userId);

          if (liker) {
            // Notify comment owner about the like by publishing an event
            // We'll use the PostLikeEvent for simplicity
            await this.eventBus.publish(
              new PostLikeEvent(
                commentOwnerId,
                postId,
                userId,
                liker.full_name || liker.username || 'A user',
              ),
            );
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the like operation if notification fails
      this.logger.error(
        `Failed to create comment like notification: ${error.message}`,
      );
    }

    return Promise.resolve(likeResult);
  };
}
