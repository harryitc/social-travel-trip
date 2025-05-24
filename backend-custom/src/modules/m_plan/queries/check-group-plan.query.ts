import { Logger, UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { CheckGroupPlanDTO } from '../dto/check-group-plan.dto';
import { ModelMapper } from '../utils/model-mapper.util';
import { GroupRepository } from '@modules/m_group/repositories/group.repository';

export class CheckGroupPlanQuery implements IQuery {
  constructor(
    public readonly dto: CheckGroupPlanDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(CheckGroupPlanQuery)
export class CheckGroupPlanQueryHandler
  implements IQueryHandler<CheckGroupPlanQuery>
{
  private readonly logger = new Logger(CheckGroupPlanQuery.name);

  constructor(
    private readonly repository: PlanRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(query: CheckGroupPlanQuery): Promise<any> {
    const { dto, userId } = query;

    // Verify user is a member of the group
    const membersResult = await this.groupRepository.getGroupMembers(dto.group_id);
    const member = membersResult.rows.find((m) => m.user_id == userId);

    if (!member) {
      this.logger.warn(`User ${userId} attempted to check plan for group ${dto.group_id} without membership`);
      throw new UnauthorizedException('You are not a member of this group');
    }

    // Check if group has a plan
    const result = await this.repository.checkGroupPlan(dto.group_id);

    if (result.rowCount == 0) {
      return {
        has_plan: false,
        plan: null,
      };
    }

    return {
      has_plan: true,
      plan: ModelMapper.toPlan(result.rows[0]),
    };
  }
}
