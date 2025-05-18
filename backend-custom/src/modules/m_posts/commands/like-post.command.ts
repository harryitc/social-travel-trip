import { Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { LikePostDTO } from '../dto/like-post.dto';
import { NotificationEventsService } from '@modules/m_notify/services/notification-events.service';
import { UserService } from '@modules/user/user.service';

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
    private readonly notificationService: NotificationEventsService,
    private readonly userService: UserService,
  ) {}

  execute = async (command: LikePostCommand): Promise<any> => {
    const { data, userId } = command;

    // Like the post
    const insertResult = await this.repository.likePost(data, userId);
    const likeResult = insertResult.rows[0];

    try {
      // Get the post to find the post owner
      const postResult = await this.repository.getPostById(data.postId);

      if (postResult && postResult.rows && postResult.rows.length > 0) {
        const post = postResult.rows[0];
        const postOwnerId = post.user_id;

        // Don't notify if the user is liking their own post
        if (postOwnerId !== userId) {
          // Get user details for notification
          const liker = await this.userService.findById(userId);

          if (liker) {
            // Notify post owner about the like
            await this.notificationService.notifyPostLike(
              postOwnerId,
              data.postId,
              userId,
              liker.full_name || liker.username || 'A user',
            );
          }
        }
      }
    } catch (error) {
      // Log error but don't fail the like operation if notification fails
      this.logger.error(`Failed to create post like notification: ${error.message}`);
    }

    return Promise.resolve(likeResult);
  };
}
