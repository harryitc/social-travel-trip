import { Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { NotifyRepository } from '../repositories/notify.repository';
import { GetNotifyDto } from '../dto/get-notify.dto';
import { Notification } from '../models/notify.model';

export class GetNotifyQuery implements IQuery {
  constructor(
    public readonly dto: GetNotifyDto,
    public readonly userId: number,
  ) {}
}

@QueryHandler(GetNotifyQuery)
export class GetNotifyQueryHandler
  implements IQueryHandler<GetNotifyQuery>
{
  private readonly logger = new Logger(GetNotifyQuery.name);

  constructor(private readonly repository: NotifyRepository) {}

  async execute(query: GetNotifyQuery): Promise<any> {
    const { dto } = query;

    // Get notification by ID
    const result = await this.repository.getNotificationById(dto.notify_id);
    
    if (result.rowCount == 0) {
      throw new NotFoundException(`Notification with ID ${dto.notify_id} not found`);
    }
    
    return Notification.fromRow(result.rows[0]);
  }
}
