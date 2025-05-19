import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { GetUserDTO } from '../dto/user.dto';

export class GetUserDetailsQuery implements IQuery {
  constructor(
    public readonly dto: GetUserDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetUserDetailsQuery)
export class GetUserDetailsQueryHandler
  implements IQueryHandler<GetUserDetailsQuery>
{
  private readonly logger = new Logger(GetUserDetailsQuery.name);

  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetUserDetailsQuery): Promise<any> {
    const { dto, userId } = query;

    // Get user details
    const result = await this.repository.getUserByID(dto.user_id);

    if (result.rowCount == 0) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    return new User(result.rows[0]);
  }
}
