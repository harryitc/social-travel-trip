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
  ) {}

  execute = async (command: CreatePostCommand): Promise<any> => {
    const { data, user_id } = command;

    // Create post
    const insertResult = await this.repository.createPost(data, user_id);
    const createdPost = insertResult.rows[0];

    try {
      // Get user details for notification
      const postCreator = await this.userService.findById(user_id);
      console.log('postCreator', postCreator);
      if (postCreator && createdPost) {
        // Get all followers of the post creator
        const followersResult =
          await this.userRelaService.getAllFollowers(user_id);
        console.log('followersResult', followersResult);

        if (followersResult && followersResult.length > 0) {
          // Extract follower IDs
          const followerIds = followersResult.map(
            (follower) => follower.user_id,
          );

          // Notify all followers about the new post by publishing an event
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
