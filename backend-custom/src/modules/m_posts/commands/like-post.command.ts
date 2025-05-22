import { Logger, NotFoundException } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { LikePostDTO } from '../dto/like-post.dto';
import { UserService } from '@modules/user/user.service';
import { PostLikeEvent } from '@modules/m_notify/events/post-like.event';
import {
  WebsocketService,
  WebsocketEvent,
} from '@modules/m_websocket/websocket.service';

export class LikePostCommand implements ICommand {
  constructor(
    public readonly data: LikePostDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostCommandHandler
  implements ICommandHandler<LikePostCommand>
{
  private readonly logger = new Logger(LikePostCommand.name);

  constructor(
    private readonly repository: PostRepository,
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
    private readonly websocketService: WebsocketService,
  ) {}

  execute = async (command: LikePostCommand): Promise<any> => {
    const { data, userId } = command;

    try {
      // First, check if the post exists
      const postResult = await this.repository.getPostById(data.postId);

      if (!postResult || !postResult.rows || postResult.rows.length == 0) {
        throw new NotFoundException(`Post with ID ${data.postId} not found`);
      }

      // Get the post owner details
      const post = postResult.rows[0];
      const postOwnerId = post.user_id;

      // Like the post
      const insertResult = await this.repository.likePost(data, userId);
      const likeResult = insertResult.rows[0];

      // Get user details for WebSocket event
      const liker = await this.userService.findById(userId);

      if (liker) {
        // Emit WebSocket event for post like
        try {
          const eventData = {
            postId: data.postId,
            userId: userId,
            userName: liker.full_name || liker.username || 'A user',
            userAvatar: liker.avatar_url || null,
            reactionId: data.reactionId,
          };

          this.logger.log(
            `Emitting WebSocket event for post like: ${data.postId}`,
          );
          this.websocketService.sendToAll(WebsocketEvent.POST_LIKED, eventData);
        } catch (wsError) {
          this.logger.error(
            `Failed to emit WebSocket event: ${wsError.message}`,
          );
        }

        // Don't notify if the user is liking their own post or if reaction_id is 1 (no like)
        if (postOwnerId != userId && data.reactionId > 1) {
          // Notify post owner about the like by publishing an event
          await this.eventBus.publish(
            new PostLikeEvent(
              postOwnerId,
              data.postId,
              userId,
              liker.full_name || liker.username || 'A user',
            ),
          );
        }
      }

      return Promise.resolve(likeResult);
    } catch (error) {
      // Log error and rethrow
      this.logger.error(`Failed to like post: ${error.message}`);
      throw error;
    }
  };
}
