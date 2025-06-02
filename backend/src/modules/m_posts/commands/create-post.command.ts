import { Logger } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';
import { CreatePostDTO } from '../dto/create-post.dto';
import { UserService } from '@modules/user/user.service';
import { UserRelaService } from '@modules/m_user_rela/services/user-rela.service';
import { NewPostFromFollowingEvent } from '@modules/m_notify/events/new-post-from-following.event';
import { WebsocketService } from '@modules/m_websocket/websocket.service';

export class CreatePostCommand implements ICommand {
  constructor(
    public readonly data: CreatePostDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  private readonly logger = new Logger(CreatePostCommand.name);

  constructor(
    private readonly repository: PostRepository,
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
    private readonly userRelaService: UserRelaService,
    private readonly websocketService: WebsocketService,
  ) {}

  execute = async (command: CreatePostCommand): Promise<any> => {
    const { data, user_id } = command;

    // Create post
    const insertResult = await this.repository.createPost(data, user_id);
    const createdPost = insertResult.rows[0];

    try {
      // Get user details for notification
      const postCreator = await this.userService.findById(user_id);

      if (postCreator && createdPost) {
        // Get all followers of the post creator first
        const followersResult =
          await this.userRelaService.getAllFollowers(user_id);

        let followerIds: number[] = [];
        if (followersResult && followersResult.length > 0) {
          // Extract follower IDs
          followerIds = followersResult.map(
            (follower: any) => follower.user_id,
          );
        }

        // Emit WebSocket event for new post to followers only (not broadcast to all)
        try {
          const postData = {
            ...createdPost,
            authorName:
              postCreator.full_name || postCreator.username || 'A user',
            authorAvatar: postCreator.avatar_url || null,
          };

          this.logger.log(
            `Emitting WebSocket event for new post: ${createdPost.post_id} to ${followerIds.length} followers`,
          );

          // Use the improved notifyNewPost method that only sends to followers
          // this.websocketService.notifyNewPost(user_id, followerIds, postData);

          this.logger.log('WebSocket event emitted successfully to followers');
        } catch (wsError) {
          this.logger.error(
            `Failed to emit WebSocket event: ${wsError.message}`,
          );
        }

        // Also publish event for notification system
        if (followerIds.length > 0) {
          await this.eventBus.publish(
            new NewPostFromFollowingEvent(
              followerIds,
              createdPost.post_id,
              user_id,
              postCreator.full_name || postCreator.username || 'A user',
            ),
          );
        }
      }
    } catch (error) {
      // Log error but don't fail the post creation if notification fails
      this.logger.error(
        `Failed to create new post notification: ${error.message}`,
      );
    }

    return Promise.resolve(createdPost);
  };
}
