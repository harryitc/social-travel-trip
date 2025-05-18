import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { UserRelaRepository } from '../repositories/user-rela.repository';

export class GetAllFollowersQuery implements IQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetAllFollowersQuery)
export class GetAllFollowersQueryHandler
  implements IQueryHandler<GetAllFollowersQuery>
{
  private readonly logger = new Logger(GetAllFollowersQuery.name);

  constructor(private readonly repository: UserRelaRepository) {}

  async execute(query: GetAllFollowersQuery): Promise<any> {
    const { userId } = query;
    const targetUserId = userId;

    // Check if user exists
    // const userExists = await this.repository.checkUserExists(targetUserId);
    // if (userExists.rowCount === 0) {
    //   throw new NotFoundException(`User with ID ${targetUserId} not found`);
    // }
    const followersResult = await this.repository.getAllFollowers(targetUserId);

    return followersResult.rows;
  }
}
