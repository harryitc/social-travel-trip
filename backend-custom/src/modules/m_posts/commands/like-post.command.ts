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
  ) {}

  execute = async (command: LikePostCommand): Promise<any> => {
    const { data, userId } = command;

    try {
      // First, check if the post exists
      const postResult = await this.repository.getPostById(data.postId);

      if (!postResult || !postResult.rows || postResult.rows.length === 0) {
        throw new NotFoundException(`Post with ID ${data.postId} not found`);
      }

      // Get the post owner details
      const post = postResult.rows[0];
      const postOwnerId = post.user_id;

      // Like the post
      const insertResult = await this.repository.likePost(data, userId);
      const likeResult = insertResult.rows[0];

      // Don't notify if the user is liking their own post
      if (postOwnerId !== userId) {
        // Get user details for notification
        const liker = await this.userService.findById(userId);

        if (liker) {
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
      this.logger.error(
        `Failed to like post: ${error.message}`,
      );
      throw error;
    }
  };
}
