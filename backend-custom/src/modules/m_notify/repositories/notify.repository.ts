import { Injectable, NotFoundException } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { CreateNotifyDto } from '../dto/create-notify.dto';
import { UpdateNotifyDto } from '../dto/update-notify.dto';
import { FilterNotifyDto } from '../dto/filter-notify.dto';

@Injectable()
export class NotifyRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotifyDto, userId: number) {
    const { type, json_data } = data;
    const query = `
      INSERT INTO notifications (
        type, json_data, is_read, created_at, user_created
      )
      VALUES ($1, $2, B'0', NOW(), $3)
      RETURNING *
    `;

    return this.client.execute(query, [type, json_data || {}, userId]);
  }

  /**
   * Update a notification
   */
  async updateNotification(data: UpdateNotifyDto, userId: number) {
    const { notify_id, type, json_data } = data;

    // Build the SET part of the query dynamically based on provided fields
    let setClause = 'user_updated = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (type != undefined) {
      setClause += `, type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (json_data != undefined) {
      setClause += `, json_data = $${paramIndex}`;
      params.push(json_data);
      paramIndex++;
    }

    // Add the notification ID as the last parameter
    params.push(notify_id);

    const query = `
      UPDATE notifications
      SET ${setClause}
      WHERE notify_id = $${paramIndex}
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notifyId: number) {
    const query = `
      DELETE FROM notifications
      WHERE notify_id = $1
      RETURNING *
    `;

    return this.client.execute(query, [notifyId]);
  }

  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(notifyId: number, userId: number) {
    const query = `
      UPDATE notifications
      SET is_read = B'1', user_updated = $1
      WHERE notify_id = $2
      RETURNING *
    `;

    return this.client.execute(query, [userId, notifyId]);
  }

  /**
   * Get a notification by ID
   */
  async getNotificationById(notifyId: number) {
    const query = `
      SELECT * FROM notifications
      WHERE notify_id = $1
    `;

    return this.client.execute(query, [notifyId]);
  }

  /**
   * Get notifications with filtering
   */
  async getNotifications(filter: FilterNotifyDto, userId: number) {
    const {
      page = 1,
      perPage = 10,
      sorts = ['created_at:desc'],
      filters = [],
    } = filter;

    let whereClause = 'user_created = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    // Apply filters
    if (filters && filters.length > 0) {
      for (const filter of filters) {
        if (filter.id == 'type' && filter.value) {
          whereClause += ` AND type = $${paramIndex}`;
          params.push(filter.value.toString());
          paramIndex++;
        }

        if (filter.id == 'is_read' && filter.value != undefined) {
          const isRead =
            filter.value == 'true' || filter.value ? "B'1'" : "B'0'";
          whereClause += ` AND is_read = ${isRead}`;
        }
      }
    }

    // Build sort clause
    let sortClause = '';
    if (sorts && sorts.length > 0) {
      const sortParts = sorts.map((sort) => {
        const [field, direction] = sort.split(':');
        return `${field} ${direction.toUpperCase()}`;
      });
      sortClause = `ORDER BY ${sortParts.join(', ')}`;
    }

    // Calculate offset
    const offset = (page - 1) * perPage;

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notifications
      WHERE ${whereClause}
    `;

    // Get paginated data
    const dataQuery = `
      SELECT *
      FROM notifications
      WHERE ${whereClause}
      ${sortClause}
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const countResult = await this.client.execute(countQuery, params);
    const dataResult = await this.client.execute(dataQuery, params);

    return {
      data: dataResult.rows,
      total: countResult.rowCount,
      page,
      perPage,
    };
  }
}
