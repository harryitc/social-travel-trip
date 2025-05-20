import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';
import { GetFollowersDto } from '../dto/get-followers.dto';
import { UserRelaWithDetails } from '../models/user-rela.model';

export class GetFollowersQuery implements IQuery {
  constructor(
    public readonly dto: GetFollowersDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetFollowersQuery)
export class GetFollowersQueryHandler
  implements IQueryHandler<GetFollowersQuery>
{
  private readonly logger = new Logger(GetFollowersQuery.name);

  constructor(private readonly repository: UserRelaRepository) {}

  async execute(query: GetFollowersQuery): Promise<any> {
    const { dto, userId } = query;
    const targetUserId = userId;

    // Check if user exists
    const userExists = await this.repository.checkUserExists(targetUserId);
    if (userExists.rowCount == 0) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    // Get followers with pagination
    const followersResult = await this.repository.getFollowers(dto, userId);

    // Get total count
    const countResult = await this.repository.countFollowers(targetUserId);
    const total = countResult.rowCount;

    // Map to model
    const followers = followersResult.rows.map((follower) => {
      return new UserRelaWithDetails(follower);
    });

    return {
      followers,
      pagination: {
        total,
        page: dto.page || 1,
        limit: dto.limit || 10,
        hasMore: (dto.page || 1) * (dto.limit || 10) < total,
      },
    };
  }
}
