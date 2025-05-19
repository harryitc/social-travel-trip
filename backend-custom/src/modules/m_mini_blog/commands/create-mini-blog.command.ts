import { Logger } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { CreateMiniBlogDTO } from '../dto/create-mini-blog.dto';
import { UserService } from '@modules/user/user.service';
import { UserRelaService } from '@modules/m_user_rela/services/user-rela.service';
import { NewMiniBlogFromFollowingEvent } from '@modules/m_notify/events/new-mini-blog-from-following.event';

export class CreateMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: CreateMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(CreateMiniBlogCommand)
export class CreateMiniBlogCommandHandler
  implements ICommandHandler<CreateMiniBlogCommand>
{
  private readonly logger = new Logger(CreateMiniBlogCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly userService: UserService,
    private readonly userRelaService: UserRelaService,
    private readonly eventBus: EventBus,
  ) {}

  execute = async (command: CreateMiniBlogCommand): Promise<any> => {
    const { data, user_id } = command;

    // Create mini blog
    const insertResult = await this.repository.createMiniBlog(data, user_id);
    const createdBlog = insertResult.rows[0];

    try {
      // Get user details for notification
      const miniBlogCreator = await this.userService.findById(user_id);

      if (miniBlogCreator) {
        // Get followers of the user
        const followersResult =
          await this.userRelaService.getAllFollowers(user_id);

        if (followersResult && followersResult.length > 0) {
          // Extract follower IDs
          const followerIds = followersResult.map(
            (follower: any) => follower.user_id,
          );

          // Notify followers about the new mini blog
          await this.eventBus.publish(
            new NewMiniBlogFromFollowingEvent(
              followerIds,
              createdBlog.mini_blog_id,
              user_id,
              miniBlogCreator.full_name || miniBlogCreator.username || 'A user',
            ),
          );
        }
      }
    } catch (error) {
      // Log error but don't fail the mini blog creation if notification fails
      this.logger.error(
        `Failed to create new mini blog notification: ${error.message}`,
      );
    }

    return Promise.resolve(createdBlog);
  };
}
