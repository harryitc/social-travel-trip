import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';
import { GetFollowingDto } from '../dto/get-following.dto';
import { UserRelaWithDetails } from '../models/user-rela.model';

export class GetFollowingQuery implements IQuery {
  constructor(
    public readonly dto: GetFollowingDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetFollowingQuery)
export class GetFollowingQueryHandler
  implements IQueryHandler<GetFollowingQuery>
{
  private readonly logger = new Logger(GetFollowingQuery.name);

  constructor(private readonly repository: UserRelaRepository) {}

  async execute(query: GetFollowingQuery): Promise<any> {
    const { dto, userId } = query;
    const targetUserId = userId;

    // Check if user exists
    const userExists = await this.repository.checkUserExists(targetUserId);
    if (userExists.rowCount == 0) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    // Get following with pagination
    const followingResult = await this.repository.getFollowing(dto, userId);

    // Get total count
    const countResult = await this.repository.countFollowing(targetUserId);
    const total = countResult.rowCount;

    // Map to model
    const following = followingResult.rows.map((follow) => {
      return new UserRelaWithDetails(follow);
    });

    return {
      following,
      pagination: {
        total,
        page: dto.page || 1,
        limit: dto.limit || 10,
        hasMore: (dto.page || 1) * (dto.limit || 10) < total,
      },
    };
  }
}
