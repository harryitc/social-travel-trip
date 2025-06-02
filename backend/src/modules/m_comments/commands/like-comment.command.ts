import { Logger, NotFoundException } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { CommentRepository } from '../repositories/comment.repository';
import { LikeCommentDTO } from '../dto/like-comment.dto';
import { UserService } from '@modules/user/user.service';
import { CommentLikeEvent } from '@modules/m_notify/events/comment-like.event';
import { WebsocketService } from '@modules/m_websocket/websocket.service';
import { PostRepository } from '@modules/m_posts/repositories/post.repository';

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
    private readonly websocketService: WebsocketService,
    private readonly postRepository: PostRepository,
  ) {}

  execute = async (command: LikeCommentCommand): Promise<any> => {
    const { data, userId } = command;

    try {
      // First, check if the comment exists
      const commentResult = await this.repository.getCommentById(
        data.commentId,
      );

      if (
        !commentResult ||
        !commentResult.rows ||
        commentResult.rows.length == 0
      ) {
        throw new NotFoundException(
          `Comment with ID ${data.commentId} not found`,
        );
      }

      // Get the comment owner details
      const comment = commentResult.rows[0];
      const commentOwnerId = comment.user_id;
      const postId = comment.post_id;

      // Like the comment
      const insertResult = await this.repository.likeComment(data, userId);
      const likeResult = insertResult.rows[0];

      // Don't notify if the user is liking their own comment or if reaction_id is 1 (no like)
      if (commentOwnerId != userId && data.reactionId > 1) {
        // Get user details for notification
        const liker = await this.userService.findById(userId);

        if (liker) {
          // Get post author ID for WebSocket notification
          let postAuthorId: number | undefined;
          try {
            const postResult = await this.postRepository.getPostById(postId);
            postAuthorId = postResult?.rows?.[0]?.user_id;
          } catch (error) {
            this.logger.error(`Failed to get post author: ${error.message}`);
          }

          // Emit WebSocket event for comment like to relevant users
          try {
            const likerData = {
              userId: userId,
              userName: liker.full_name || liker.username || 'A user',
              userAvatar: liker.avatar_url || null,
              reactionId: data.reactionId,
            };

            this.logger.log(`Emitting WebSocket event for comment like: ${data.commentId}`);

            // Use the improved notifyCommentLiked method that targets specific users
            // this.websocketService.notifyCommentLiked(
            //   data.commentId,
            //   commentOwnerId,
            //   userId,
            //   likerData,
            //   postAuthorId,
            // );
          } catch (wsError) {
            this.logger.error(`Failed to emit WebSocket event: ${wsError.message}`);
          }

          // Notify comment owner about the like by publishing an event
          await this.eventBus.publish(
            new CommentLikeEvent(
              commentOwnerId,
              postId,
              data.commentId,
              userId,
              liker.full_name || liker.username || 'A user',
            ),
          );
        }
      }

      return Promise.resolve(likeResult);
    } catch (error) {
      // Log error and rethrow
      this.logger.error(`Failed to like comment: ${error.message}`);
      throw error;
    }
  };
}
