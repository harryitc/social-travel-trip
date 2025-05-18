import { Logger } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { FilterNotifyDto } from '../dto/filter-notify.dto';
import { Notification } from '../models/notify.model';

export class FilterNotifyQuery implements IQuery {
  constructor(
    public readonly dto: FilterNotifyDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(FilterNotifyQuery)
export class FilterNotifyQueryHandler
  implements IQueryHandler<FilterNotifyQuery>
{
  private readonly logger = new Logger(FilterNotifyQuery.name);

  constructor(private readonly repository: NotifyRepository) {}

  async execute(query: FilterNotifyQuery): Promise<any> {
    const { dto, userId } = query;

    // Get notifications with filtering
    const result = await this.repository.getNotifications(dto, userId);
    
    // Map data to Notification model
    const notifications = result.data.map(row => Notification.fromRow(row));
    
    return {
      data: notifications,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
    };
  }
}
