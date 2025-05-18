import { Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';
import { FollowUserDto } from '../dto/follow-user.dto';

export class UnfollowUserCommand implements ICommand {
  constructor(
    public readonly dto: FollowUserDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(UnfollowUserCommand)
export class UnfollowUserCommandHandler
  implements ICommandHandler<UnfollowUserCommand>
{
  private readonly logger = new Logger(UnfollowUserCommand.name);

  constructor(private readonly repository: UserRelaRepository) {}

  async execute(command: UnfollowUserCommand): Promise<any> {
    const { dto, userId } = command;

    // Prevent unfollowing yourself
    if (userId === dto.following_id) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    // Check if following exists
    const checkResult = await this.repository.checkFollowStatus(userId, dto.following_id);
    if (checkResult.rowCount === 0) {
      throw new NotFoundException('You are not following this user');
    }

    // Unfollow user
    await this.repository.unfollowUser(userId, dto.following_id);
    
    return { message: 'Successfully unfollowed user' };
  }
}
