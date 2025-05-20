import { Logger, BadRequestException } from '@nestjs/common';
import {
  CommandHandler,
  ICommand,
  ICommandHandler,
  EventBus,
} from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';
import { FollowUserDto } from '../dto/follow-user.dto';
import { UserRela } from '../models/user-rela.model';
import { UserService } from '@modules/user/user.service';
import { NewFollowerEvent } from '@modules/m_notify/events/new-follower.event';

export class FollowUserCommand implements ICommand {
  constructor(
    public readonly dto: FollowUserDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(FollowUserCommand)
export class FollowUserCommandHandler
  implements ICommandHandler<FollowUserCommand>
{
  private readonly logger = new Logger(FollowUserCommand.name);

  constructor(
    private readonly repository: UserRelaRepository,
    private readonly eventBus: EventBus,
    private readonly userService: UserService,
  ) {}

  async execute(command: FollowUserCommand): Promise<any> {
    const { dto, userId } = command;

    // Prevent following yourself
    if (userId == dto.following_id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Follow user
    const result = await this.repository.followUser(userId, dto.following_id);

    if (result.rowCount == 0) {
      // User is already following
      return { message: 'Already following this user' };
    }

    try {
      // Get follower user details to include in notification
      const followerUser = await this.userService.findById(userId);

      if (followerUser) {
        // Create notification for the user being followed by publishing an event
        await this.eventBus.publish(
          new NewFollowerEvent(
            dto.following_id,
            userId,
            followerUser.full_name || followerUser.username || 'A user',
          ),
        );
      }
    } catch (error) {
      // Log error but don't fail the follow operation if notification fails
      this.logger.error(
        `Failed to create follow notification: ${error.message}`,
      );
    }

    return new UserRela(result.rows[0]);
  }
}
