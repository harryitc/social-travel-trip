import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { LikeMiniBlogCommentDTO } from '../dto/like-mini-blog.dto';
import { UserService } from '@modules/user/user.service';
import { MiniBlogCommentLikeEvent } from '@modules/m_notify/events/mini-blog-comment-like.event';

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
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  execute = async (command: LikeMiniBlogCommentCommand): Promise<any> => {
    const { data, userId } = command;

    // Check if comment exists
    const commentResult = await this.repository.getCommentById(data.commentId);
    if (!commentResult || commentResult.rowCount == 0) {
      throw new NotFoundException(
        `Comment with ID ${data.commentId} not found`,
      );
    }

    // Like the comment
    const insertResult = await this.repository.likeComment(data, userId);
    const likeResult = insertResult.rows[0];

    try {
      // We already have the comment from the check above
      const comment = commentResult.rows[0];
      const commentOwnerId = comment.user_id;
      const miniBlogId = comment.mini_blog_id;

      // Don't notify if the user is liking their own comment or if reaction_id is 1 (no like)
      if (commentOwnerId != userId && data.reactionId > 1) {
        // Get user details for notification
        const liker = await this.userService.findById(userId);

        if (liker) {
          // Notify comment owner about the like by publishing an event
          await this.eventBus.publish(
            new MiniBlogCommentLikeEvent(
              commentOwnerId,
              miniBlogId,
              data.commentId,
              userId,
              liker.full_name || liker.username || 'A user',
            )
          );
        }
      }
    } catch (error) {
      // Log error but don't fail the like operation if notification fails
      this.logger.error(
        `Failed to create comment like notification: ${error.message}`,
      );
    }

    // Get reaction statistics for the comment
    const reactionStats =
      await this.repository.getLikesByCommentIdWithReactions(data.commentId);

    // Get total likes (including default likes with reaction_id = 1)
    const totalLikesResult = await this.repository.getLikesByCommentId(
      data.commentId,
    );

    // Calculate total likes across all reaction types
    const total =
      totalLikesResult.rowCount > 0
        ? totalLikesResult.rows.reduce((sum, row) => sum + Number(row.count), 0)
        : 0;

    return {
      like: likeResult,
      stats: {
        total,
        reactions: reactionStats.rows || [],
      },
    };
  };
}
