import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { GetPlansDTO } from '../dto/get-plans.dto';
import { Plan } from '../models/plan.model';

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

    const plans = plansResult.rows.map((plan) => new Plan(plan));
    const total = parseInt(countResult.rows[0].count, 10);
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
