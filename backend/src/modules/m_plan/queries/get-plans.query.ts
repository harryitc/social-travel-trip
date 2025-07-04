import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { GetPlansDTO } from '../dto/get-plans.dto';
import { ModelMapper } from '../utils/model-mapper.util';

export class GetPlansQuery implements IQuery {
  constructor(
    public readonly dto: GetPlansDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetPlansQuery)
export class GetPlansQueryHandler implements IQueryHandler<GetPlansQuery> {
  private readonly logger = new Logger(GetPlansQuery.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(query: GetPlansQuery): Promise<any> {
    const { dto, userId } = query;

    // Get plans with filtering, pagination, and sorting
    const [plansResult, countResult] = await Promise.all([
      this.repository.getPlans(dto, userId),
      this.repository.getPlansCount(dto, userId),
    ]);

    const plans = ModelMapper.toPlans(plansResult.rows);
    const total = countResult.rowCount;
    const page = dto.page || 1;
    const limit = dto.limit || 10;

    return {
      data: plans,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
