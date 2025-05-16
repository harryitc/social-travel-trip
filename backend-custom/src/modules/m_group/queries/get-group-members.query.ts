import { Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { GroupRepository } from '../repositories/group.repository';
import { GetGroupMembersDto } from '../dto/get-group-members.dto';
import { GroupMember } from '../models/group.model';

export class GetGroupMembersQuery implements IQuery {
  constructor(
    public readonly dto: GetGroupMembersDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetGroupMembersQuery)
export class GetGroupMembersQueryHandler
  implements IQueryHandler<GetGroupMembersQuery>
{
  private readonly logger = new Logger(GetGroupMembersQuery.name);

  constructor(private readonly repository: GroupRepository) {}

  async execute(query: GetGroupMembersQuery): Promise<any> {
    const { dto, userId } = query;

    // // Verify member is in group
    // const membersResult = await this.repository.getGroupMembers(dto.group_id);
    // const member = membersResult.rows.find((m) => m.user_id == userId);

    // if (!member) {
    //   throw new UnauthorizedException('User is not a member of this group');
    // }

    // Get members with pagination
    const result = await this.repository.getGroupMembersWithPagination(dto);

    if (result.rowCount == 0 && dto.page > 1) {
      throw new NotFoundException('No more members found');
    }

    // Get total count
    const countResult = await this.repository.countGroupMembers(dto.group_id);
    const total = parseInt(countResult.rows[0].total, 10);

    // Map to model
    const members = result.rows.map((member) => new GroupMember(member));

    return {
      members,
      pagination: {
        total,
        page: dto.page || 1,
        limit: dto.limit || 10,
        hasMore: (dto.page || 1) * (dto.limit || 10) < total,
      },
    };
  }
}
