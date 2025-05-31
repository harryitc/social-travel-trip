import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNotifyDto } from '../dto/create-notify.dto';
import { UpdateNotifyDto } from '../dto/update-notify.dto';
import { DeleteNotifyDto } from '../dto/delete-notify.dto';
import { GetNotifyDto } from '../dto/get-notify.dto';
import { FilterNotifyDto } from '../dto/filter-notify.dto';
import { MarkReadNotifyDto } from '../dto/mark-read-notify.dto';
import { MarkAllReadNotifyDto } from '../dto/mark-all-read-notify.dto';
import { CreateNotifyCommand } from '../commands/create-notify.command';
import { UpdateNotifyCommand } from '../commands/update-notify.command';
import { DeleteNotifyCommand } from '../commands/delete-notify.command';
import { MarkReadNotifyCommand } from '../commands/mark-read-notify.command';
import { MarkAllReadNotifyCommand } from '../commands/mark-all-read-notify.command';
import { GetNotifyQuery } from '../queries/get-notify.query';
import { FilterNotifyQuery } from '../queries/filter-notify.query';

@Injectable()
export class NotifyService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Create a new notification
   */
  async createNotification(dto: CreateNotifyDto, userId: number) {
    return this.commandBus.execute(new CreateNotifyCommand(dto, userId));
  }

  /**
   * Update a notification
   */
  async updateNotification(dto: UpdateNotifyDto, userId: number) {
    return this.commandBus.execute(new UpdateNotifyCommand(dto, userId));
  }

  /**
   * Delete a notification
   */
  async deleteNotification(dto: DeleteNotifyDto, userId: number) {
    return this.commandBus.execute(new DeleteNotifyCommand(dto, userId));
  }

  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(dto: MarkReadNotifyDto, userId: number) {
    return this.commandBus.execute(new MarkReadNotifyCommand(dto, userId));
  }

  /**
   * Get a notification by ID
   */
  async getNotification(dto: GetNotifyDto, userId: number) {
    return this.queryBus.execute(new GetNotifyQuery(dto, userId));
  }

  /**
   * Get notifications with filtering
   */
  async getNotifications(dto: FilterNotifyDto, userId: number) {
    return this.queryBus.execute(new FilterNotifyQuery(dto, userId));
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllNotificationsAsRead(dto: MarkAllReadNotifyDto, userId: number) {
    return this.commandBus.execute(new MarkAllReadNotifyCommand(dto, userId));
  }
}
