import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PlanRepository } from '../repositories/plan.repository';
import { GetSchedulesDTO } from '../dto/get-schedules.dto';
import { ModelMapper } from '../utils/model-mapper.util';

export class GetSchedulesQuery implements IQuery {
  constructor(
    public readonly dto: GetSchedulesDTO,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetSchedulesQuery)
export class GetSchedulesQueryHandler
  implements IQueryHandler<GetSchedulesQuery>
{
  private readonly logger = new Logger(GetSchedulesQuery.name);

  constructor(private readonly repository: PlanRepository) {}

  async execute(query: GetSchedulesQuery): Promise<any> {
    const { dto, userId } = query;

    // Check if day place exists
    const dayPlaceResult = await this.repository.getDayPlaceById(
      dto.plan_day_place_id,
    );

    if (dayPlaceResult.rowCount === 0) {
      throw new NotFoundException(
        `Day place with ID ${dto.plan_day_place_id} not found`,
      );
    }

    const dayPlace = dayPlaceResult.rows[0];

    // Check if plan exists and user has access
    const planResult = await this.repository.getPlanById(dayPlace.plan_id);

    if (planResult.rowCount === 0) {
      throw new NotFoundException(`Plan not found`);
    }

    const plan = planResult.rows[0];

    // Check if user has access to this plan
    if (plan.status !== 'public' && plan.user_created !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to view schedules for this plan',
      );
    }

    // Get schedules with pagination
    const [schedulesResult, countResult] = await Promise.all([
      this.repository.getSchedules(dto),
      this.repository.getSchedulesCount(dto.plan_day_place_id),
    ]);

    const schedules = ModelMapper.toPlanSchedules(schedulesResult.rows);
    const total = parseInt(countResult.rows[0].count, 10);
    const page = dto.page || 1;
    const limit = dto.limit || 10;

    return {
      day_place: dayPlace,
      schedules,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
