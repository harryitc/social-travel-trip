import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import {
  CreateActivityDto,
  QueryActivityDto,
  UpdateActivityDto,
} from '../dto/activity.dto';
import { removeVietnameseAccents } from '@common/utils/string-utils';

@Injectable()
export class ActivityRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async create(data: CreateActivityDto) {
    const { name, slug } = data;
    const finalSlug = slug || this.generateSlug(name);

    const query = `
      INSERT INTO activities (name, slug)
      VALUES ($1, $2)
      RETURNING *
    `;
    return this.client.execute(query, [name, finalSlug]);
  }

  async update(data: UpdateActivityDto) {
    const { activity_id, name, slug } = data;
    const finalSlug = slug || this.generateSlug(name);

    const query = `
      UPDATE activities
      SET name = $1, slug = $2
      WHERE activity_id = $3
      RETURNING *
    `;
    return this.client.execute(query, [name, finalSlug, activity_id]);
  }

  async delete(activityId: number) {
    const query = `
      DELETE FROM activities
      WHERE activity_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [activityId]);
  }

  async findById(activityId: number) {
    const query = `
      SELECT * FROM activities
      WHERE activity_id = $1
    `;
    return this.client.execute(query, [activityId]);
  }

  async findByName(name: string) {
    const query = `
      SELECT * FROM activities
      WHERE name = $1
    `;
    return this.client.execute(query, [name]);
  }

  async createIfNotExists(name: string) {
    const slug = this.generateSlug(name);

    const query = `
      INSERT INTO activities (name, slug)
      VALUES ($1, $2)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    return this.client.execute(query, [name, slug]);
  }

  async findAll(queryDto: QueryActivityDto) {
    const { page = 1, limit = 10, search } = queryDto;
    const offset = (page - 1) * limit;

    const textSlug = this.generateSlug(search);

    let query = `
      SELECT * FROM activities
    `;

    const params = [];
    let paramIndex = 1;

    if (textSlug) {
      query += ` WHERE name ILIKE $${paramIndex}`;
      params.push(`%${textSlug}%`);
      paramIndex++;
    }

    // Add count query
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_query`;

    // Add pagination
    query += ` ORDER BY activity_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const data = await this.client.execute(query, params);
    const count = await this.client.execute(
      countQuery,
      params.slice(0, paramIndex - 1),
    );

    return {
      data,
      total: parseInt(count.rows[0].count),
    };
  }

  private generateSlug(name: string): string {
    return removeVietnameseAccents(name);
  }
}
