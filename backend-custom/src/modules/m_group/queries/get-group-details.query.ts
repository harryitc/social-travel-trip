import {
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetGroupDetailsDto } from '../dto/get-group-details.dto';
import { Group } from '../models/group.model';

export class GetGroupDetailsQuery implements IQuery {
  constructor(
    public readonly dto: GetGroupDetailsDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetGroupDetailsQuery)
export class GetGroupDetailsQueryHandler
  implements IQueryHandler<GetGroupDetailsQuery>
{
  private readonly logger = new Logger(GetGroupDetailsQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetGroupDetailsQuery): Promise<any> {
    const { dto, userId } = query;

    // Get group details
    const result = await this.repository.getGroupById(dto.group_id);

    if (result.rowCount == 0) {
      throw new NotFoundException('Group not found');
    }

    // Get member count
    const countResult = await this.repository.countGroupMembers(dto.group_id);
    const memberCount = parseInt(countResult.rows[0].total, 10);

    // Get message count
    const messageCountResult = await this.repository.countMessages(
      dto.group_id,
    );
    const messageCount = parseInt(messageCountResult.rows[0].total, 10);

    // Map to model and add additional info
    const group = new Group(result.rows[0]);
    return {
      ...group,
      member_count: memberCount,
      message_count: messageCount,
    };
  }
}
