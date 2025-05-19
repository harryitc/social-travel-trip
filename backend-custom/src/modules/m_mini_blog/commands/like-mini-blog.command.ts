import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { MiniBlogRepository } from '../repositories/mini-blog.repository';
import { LikeMiniBlogDTO } from '../dto/like-mini-blog.dto';
import { UserService } from '@modules/user/user.service';

export class LikeMiniBlogCommand implements ICommand {
  constructor(
    public readonly data: LikeMiniBlogDTO,
    public readonly userId: number,
  ) {}
}

@CommandHandler(LikeMiniBlogCommand)
export class LikeMiniBlogCommandHandler
  implements ICommandHandler<LikeMiniBlogCommand>
{
  private readonly logger = new Logger(LikeMiniBlogCommand.name);

  constructor(
    private readonly repository: MiniBlogRepository,
    private readonly userService: UserService,
  ) {}

  execute = async (command: LikeMiniBlogCommand): Promise<any> => {
    const { data, userId } = command;

    // Check if mini blog exists
    const miniBlogResult = await this.repository.getMiniBlogById(
      data.miniBlogId,
    );
    if (!miniBlogResult || miniBlogResult.rowCount === 0) {
      throw new NotFoundException(
        `Mini blog with ID ${data.miniBlogId} not found`,
      );
    }

    // Like the mini blog
    const insertResult = await this.repository.likeMiniBlog(data, userId);
    const likeResult = insertResult.rows[0];

    try {
      // We already have the mini blog from the check above
      const miniBlog = miniBlogResult.rows[0];
      const miniBlogOwnerId = miniBlog.user_id;

      // Don't notify if the user is liking their own mini blog
      if (miniBlogOwnerId !== userId) {
        // Get user details for notification
        const liker = await this.userService.findById(userId);

        if (liker) {
          // Notify mini blog owner about the like
          
        }
      }
    } catch (error) {
      // Log error but don't fail the like operation if notification fails
      this.logger.error(
        `Failed to create mini blog like notification: ${error.message}`,
      );
    }

    // Get reaction statistics for the mini blog
    const reactionStats =
      await this.repository.getLikesByMiniBlogIdWithReactions(data.miniBlogId);

    // Get total likes (including default likes with reaction_id = 1)
    const totalLikesResult = await this.repository.getLikesByMiniBlogId(
      data.miniBlogId,
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
