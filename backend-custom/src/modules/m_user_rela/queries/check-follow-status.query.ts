import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';
import { CheckFollowStatusDto } from '../dto/check-follow-status.dto';

export class CheckFollowStatusQuery implements IQuery {
  constructor(
    public readonly dto: CheckFollowStatusDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(CheckFollowStatusQuery)
export class CheckFollowStatusQueryHandler
  implements IQueryHandler<CheckFollowStatusQuery>
{
  private readonly logger = new Logger(CheckFollowStatusQuery.name);

  constructor(private readonly repository: UserRelaRepository) {}

  async execute(query: CheckFollowStatusQuery): Promise<any> {
    const { dto, userId } = query;

    // Check if target user exists
    const userExists = await this.repository.checkUserExists(dto.following_id);
    if (userExists.rowCount === 0) {
      throw new NotFoundException(`User with ID ${dto.following_id} not found`);
    }

    // Check follow status
    const result = await this.repository.checkFollowStatus(userId, dto.following_id);
    
    return {
      isFollowing: result.rowCount > 0,
    };
  }
}
