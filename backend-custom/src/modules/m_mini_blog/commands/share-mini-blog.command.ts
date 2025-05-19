import { Logger, NotFoundException } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { ShareMiniBlogDTO } from '../dto/share-mini-blog.dto';
import { UserService } from '@modules/user/user.service';
import { MiniBlogShareEvent } from '@modules/m_notify/events/mini-blog-share.event';

export class ShareMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: ShareMiniBlogDTO,
    public readonly user_id: number,
  ) {}
}

@CommandHandler(ShareMiniBlogCommand)
export class ShareMiniBlogCommandHandler
  implements ICommandHandler<ShareMiniBlogCommand>
{
  private readonly logger = new Logger(ShareMiniBlogCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  execute = async (command: ShareMiniBlogCommand): Promise<any> => {
    const { data, user_id } = command;
    const { miniBlogId, platform, shareData } = data;

    const shareResult = await this.repository.shareMiniBlog(
      miniBlogId,
      platform,
      shareData,
      user_id,
    );

    const sharedBlog = shareResult.rows[0];

    try {
      // Get mini blog to find owner
      const miniBlogResult = await this.repository.getMiniBlogById(miniBlogId);
      if (!miniBlogResult || miniBlogResult.rowCount === 0) {
        throw new NotFoundException(
          `Mini blog with ID ${miniBlogId} not found`,
        );
      }

      const miniBlog = miniBlogResult.rows[0];
      const miniBlogOwnerId = miniBlog.user_id;

      // Don't notify if user is sharing their own mini blog
      if (miniBlogOwnerId !== user_id) {
        // Get user details for notification
        const sharer = await this.userService.findById(user_id);

        if (sharer) {
          // Notify mini blog owner about the share by publishing an event
          await this.eventBus.publish(
            new MiniBlogShareEvent(
              miniBlogOwnerId,
              miniBlogId,
              user_id,
              sharer.full_name || sharer.username || 'A user',
              platform,
            ),
          );
        }
      }
    } catch (error) {
      // Log error but don't fail the share operation if notification fails
      this.logger.error(
        `Failed to create mini blog share notification: ${error.message}`,
      );
    }

    return Promise.resolve(sharedBlog);
  };
}
