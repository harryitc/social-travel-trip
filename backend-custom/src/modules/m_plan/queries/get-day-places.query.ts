import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { GetDayPlacesDTO } from '../dto/get-day-places.dto';
import { ModelMapper } from '../utils/model-mapper.util';

export class GetDayPlacesQuery implements IQuery {
  constructor(
    public readonly dto: GetDayPlacesDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetDayPlacesQuery)
export class GetDayPlacesQueryHandler
  implements IQueryHandler<GetDayPlacesQuery>
{
  private readonly logger = new Logger(GetDayPlacesQuery.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(query: GetDayPlacesQuery): Promise<any> {
    const { dto, userId } = query;

    // Check if plan exists and user has access
    const planResult = await this.repository.getPlanById(dto.plan_id);

    if (planResult.rowCount == 0) {
      throw new NotFoundException(`Plan with ID ${dto.plan_id} not found`);
    }

    const plan = planResult.rows[0];

    // Check if user has access to this plan
    if (plan.status != 'public' && plan.user_created != userId) {
      throw new NotFoundException(`Plan with ID ${dto.plan_id} not found`);
    }

    // Get day places for the specific day
    const dayPlacesResult = await this.repository.getDayPlaces(
      dto.plan_id,
      dto.day,
    );

    if (dayPlacesResult.rowCount == 0) {
      return {
        day: dto.day,
        places: [],
      };
    }

    const dayPlaces = ModelMapper.toPlanDayPlaces(dayPlacesResult.rows);

    // Get schedules for each day place
    const dayPlacesWithSchedules = await Promise.all(
      dayPlaces.map(async (dayPlace) => {
        const schedulesResult = await this.repository.getPlanSchedules(
          dayPlace.plan_day_place_id,
        );
        const schedules = ModelMapper.toPlanSchedules(schedulesResult.rows);
        return {
          ...dayPlace,
          schedules,
        };
      }),
    );

    return {
      day: dto.day,
      places: dayPlacesWithSchedules,
    };
  }
}
