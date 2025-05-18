import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '../../repositories/activity.repository';
import { GetActivityDto } from '../../dto/activity.dto';
import { Activity } from '../../models/others.model';

export class GetActivityQuery implements IQuery {
  constructor(
    public readonly dto: GetActivityDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetActivityQuery)
export class GetActivityQueryHandler
  implements IQueryHandler<GetActivityQuery>
{
  private readonly logger = new Logger(GetActivityQuery.name);

  constructor(private readonly repository: ActivityRepository) {}

  async execute(query: GetActivityQuery): Promise<any> {
    const { dto } = query;

    // Get activity by ID
    const result = await this.repository.findById(dto.activity_id);
    
    if (result.rowCount === 0) {
      throw new NotFoundException(`Activity with ID ${dto.activity_id} not found`);
    }
    
    return new Activity(result.rows[0]);
  }
}
