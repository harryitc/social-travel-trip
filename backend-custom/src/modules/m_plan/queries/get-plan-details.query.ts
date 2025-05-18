import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { GetPlanDetailsDTO } from '../dto/get-plan-details.dto';
import { Plan, PlanDayPlace, PlanSchedule } from '../models/plan.model';

export class GetPlanDetailsQuery implements IQuery {
  constructor(
    public readonly dto: GetPlanDetailsDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetPlanDetailsQuery)
export class GetPlanDetailsQueryHandler implements IQueryHandler<GetPlanDetailsQuery> {
  private readonly logger = new Logger(GetPlanDetailsQuery.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(query: GetPlanDetailsQuery): Promise<any> {
    const { dto, userId } = query;

    // Get plan details
    const planResult = await this.repository.getPlanById(dto.plan_id);
    
    if (planResult.rowCount === 0) {
      throw new NotFoundException(`Plan with ID ${dto.plan_id} not found`);
    }

    const plan = new Plan(planResult.rows[0]);
    
    // Check if user has access to this plan
    if (plan.status !== 'public' && plan.user_created !== userId) {
      throw new NotFoundException(`Plan with ID ${dto.plan_id} not found`);
    }

    // Get day places
    const dayPlacesResult = await this.repository.getPlanDayPlaces(dto.plan_id);
    const dayPlaces = dayPlacesResult.rows.map(dayPlace => new PlanDayPlace(dayPlace));

    // Get schedules for each day place
    const dayPlacesWithSchedules = await Promise.all(
      dayPlaces.map(async (dayPlace) => {
        const schedulesResult = await this.repository.getPlanSchedules(dayPlace.plan_day_place_id);
        const schedules = schedulesResult.rows.map(schedule => new PlanSchedule(schedule));
        return {
          ...dayPlace,
          schedules,
        };
      })
    );

    return {
      ...plan,
      day_places: dayPlacesWithSchedules,
    };
  }
}
