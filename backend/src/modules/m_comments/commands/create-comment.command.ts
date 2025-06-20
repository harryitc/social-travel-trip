import { Logger, NotFoundException } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { UserService } from '@modules/user/user.service';
import { PostRepository } from '@modules/m_posts/repositories/post.repository';
import { CommentReplyEvent } from '@modules/m_notify/events/comment-reply.event';
import { PostCommentEvent } from '@modules/m_notify/events/post-comment.event';
import { WebsocketService } from '@modules/m_websocket/websocket.service';

export class CreateCommentCommand implements ICommand {
  constructor(
    public readonly data: CreateCommentDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  private readonly logger = new Logger(CreateCommentCommand.name);

  constructor(
    private readonly repository: CommentRepository,
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
    private readonly websocketService: WebsocketService,
  ) {}

  execute = async (command: CreateCommentCommand): Promise<any> => {
    const { data, user_id } = command;

    try {
      // Validate post exists
      const postResult = await this.postRepository.getPostById(data.postId);
      if (!postResult || !postResult.rows || postResult.rows.length == 0) {
        throw new NotFoundException(`Post with ID ${data.postId} not found`);
      }

      // Validate parent comment exists if provided and enforce 2-level hierarchy
      let finalParentId = data.parentId;
      if (data.parentId) {
        const parentCommentResult = await this.repository.getCommentById(
          data.parentId,
        );
        if (
          !parentCommentResult ||
          !parentCommentResult.rows ||
          parentCommentResult.rows.length == 0
        ) {
          throw new NotFoundException(
            `Parent comment with ID ${data.parentId} not found`,
          );
        }

        const parentComment = parentCommentResult.rows[0];

        // If the parent comment already has a parent (it's a level 2 comment),
        // then make this comment a sibling (also level 2) by using the same parent
        if (parentComment.parent_id) {
          finalParentId = parentComment.parent_id;
          this.logger.log(
            `Comment ${data.parentId} is already level 2, making new comment sibling with parent ${finalParentId}`
          );
        }
      }

      // Create comment with the adjusted parent ID
      const adjustedData = { ...data, parentId: finalParentId };
      const insertResult = await this.repository.createComment(adjustedData, user_id);
      const createdComment = insertResult.rows[0];

      // Get user details for WebSocket event
      const commenter = await this.userService.findById(user_id);

      if (commenter && createdComment) {
        // Get comment thread participants for targeted WebSocket notification
        let threadParticipantIds: number[] = [];
        try {
          const participantsResult =
            await this.repository.getCommentThreadParticipants(data.postId);
          if (participantsResult && participantsResult.rows) {
            threadParticipantIds = participantsResult.rows.map(
              (row: any) => row.user_id,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to get thread participants: ${error.message}`,
          );
        }

        // Emit WebSocket event for new comment to relevant users only
        try {
          const commenterData = {
            userId: user_id,
            userName: commenter.full_name || commenter.username || 'A user',
            userAvatar: commenter.avatar_url || null,
          };

          const commentData = {
            ...createdComment,
            parentId: finalParentId || null,
          };

          // Get post details to find post author
          const postResult = await this.postRepository.getPostById(data.postId);
          const postAuthorId = postResult?.rows?.[0]?.user_id;

          this.logger.log(
            `Emitting WebSocket event for new comment on post: ${data.postId} to relevant users`,
          );

          // Use the improved notifyNewComment method that targets specific users
          // this.websocketService.notifyNewComment(
          //   data.postId,
          //   postAuthorId,
          //   user_id,
          //   commenterData,
          //   commentData,
          //   threadParticipantIds,
          // );
        } catch (wsError) {
          this.logger.error(
            `Failed to emit WebSocket event: ${wsError.message}`,
          );
        }
      }

      // Check if this is a reply to another comment
      if (finalParentId) {
        // This is a reply to another comment
        // Get the parent comment to find its owner
        const parentCommentResult = await this.repository.getCommentById(
          finalParentId,
        );

        if (
          parentCommentResult &&
          parentCommentResult.rows &&
          parentCommentResult.rows.length > 0
        ) {
          const parentComment = parentCommentResult.rows[0];
          const commentOwnerId = parentComment.user_id;

          // Don't notify if the user is replying to their own comment
          if (commentOwnerId != user_id) {
            // Get user details for notification
            const replier = await this.userService.findById(user_id);

            if (replier) {
              // Notify comment owner about the reply by publishing an event
              await this.eventBus.publish(
                new CommentReplyEvent(
                  commentOwnerId,
                  data.postId,
                  finalParentId,
                  createdComment.post_comment_id,
                  user_id,
                  replier.full_name || replier.username || 'A user',
                ),
              );
            }
          }
        }
      } else {
        // This is a comment on a post
        // Get the post to find the post owner
        const postResult = await this.postRepository.getPostById(data.postId);

        if (postResult && postResult.rows && postResult.rows.length > 0) {
          const post = postResult.rows[0];
          const postOwnerId = post.user_id;

          // Don't notify if the user is commenting on their own post
          if (postOwnerId != user_id) {
            // Get user details for notification
            const commenter = await this.userService.findById(user_id);

            if (commenter) {
              // Notify post owner about the comment by publishing an event
              await this.eventBus.publish(
                new PostCommentEvent(
                  postOwnerId,
                  data.postId,
                  createdComment.post_comment_id,
                  user_id,
                  commenter.full_name || commenter.username || 'A user',
                ),
              );
            }
          }
        }
      }

      return Promise.resolve(createdComment);
    } catch (error) {
      // Log error
      this.logger.error(`Failed to create comment: ${error.message}`);
      throw error;
    }
  };
}
