import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { CheckGroupPlanDTO } from '../dto/check-group-plan.dto';
import { ModelMapper } from '../utils/model-mapper.util';

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

  constructor(private readonly repository: PlanRepository) {}

  async execute(query: CheckGroupPlanQuery): Promise<any> {
    const { dto } = query;

    // Check if group has a plan
    const result = await this.repository.checkGroupPlan(dto.group_id);

    if (result.rowCount === 0) {
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
