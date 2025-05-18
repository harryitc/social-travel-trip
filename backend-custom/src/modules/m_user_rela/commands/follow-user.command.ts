import { Logger, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';
import { FollowUserDto } from '../dto/follow-user.dto';
import { UserRela } from '../models/user-rela.model';

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

  constructor(private readonly repository: UserRelaRepository) {}

  async execute(command: FollowUserCommand): Promise<any> {
    const { dto, userId } = command;

    // Prevent following yourself
    if (userId === dto.following_id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Follow user
    const result = await this.repository.followUser(userId, dto.following_id);
    
    if (result.rowCount === 0) {
      // User is already following
      return { message: 'Already following this user' };
    }
    
    return new UserRela(result.rows[0]);
  }
}
