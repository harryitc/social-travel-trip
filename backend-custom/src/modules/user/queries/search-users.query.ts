import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { SearchUserDTO } from '../dto/user.dto';

export class SearchUsersQuery implements IQuery {
  constructor(
    public readonly dto: SearchUserDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(SearchUsersQuery)
export class SearchUsersQueryHandler
  implements IQueryHandler<SearchUsersQuery>
{
  private readonly logger = new Logger(SearchUsersQuery.name);

  constructor(private readonly repository: UserRepository) {}

  async execute(query: SearchUsersQuery): Promise<any> {
    const { dto } = query;

    // Search users
    const result = await this.repository.searchUsers(dto);

    // Map users to User model
    const users = result.data.map((user) => new User(user));

    return {
      data: users,
      total: result.total,
      // page: result.page,
      // limit: result.limit,
      // totalPages: result.totalPages,
    };
  }
}
