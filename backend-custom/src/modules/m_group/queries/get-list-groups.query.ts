import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { Group } from '../models/group.model';

export class GetListGroupsQuery implements IQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetListGroupsQuery)
export class GetListGroupsQueryHandler
  implements IQueryHandler<GetListGroupsQuery>
{
  private readonly logger = new Logger(GetListGroupsQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetListGroupsQuery): Promise<any> {
    const { userId } = query;

    // Get messages with pagination
    const groupsQueryResult = await this.repository.getListGroups(userId);

    if (groupsQueryResult.rowCount == 0) {
      throw new NotFoundException('No groups found');
    }

    return groupsQueryResult.rows.map((item) => new Group(item));
  }
}
