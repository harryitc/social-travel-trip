import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '../../repositories/activity.repository';
import { QueryActivityDto } from '../../dto/activity.dto';
import { Activity } from '../../models/others.model';

export class QueryActivitiesQuery implements IQuery {
  constructor(
    public readonly dto: QueryActivityDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(QueryActivitiesQuery)
export class QueryActivitiesQueryHandler
  implements IQueryHandler<QueryActivitiesQuery>
{
  private readonly logger = new Logger(QueryActivitiesQuery.name);

  constructor(private readonly repository: ActivityRepository) {}

  async execute(query: QueryActivitiesQuery): Promise<any> {
    const { dto } = query;

    // Query activities with pagination
    const result = await this.repository.findAll(dto);
    
    return {
      data: result.data.rows.map(row => new Activity(row)),
      total: result.total,
      page: dto.page || 1,
      limit: dto.limit || 10,
    };
  }
}
