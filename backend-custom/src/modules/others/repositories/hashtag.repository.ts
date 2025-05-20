import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import {
  CreateHashtagDto,
  QueryHashtagDto,
  UpdateHashtagDto,
} from '../dto/hashtag.dto';
import { removeVietnameseAccents } from '@common/utils/string-utils';

@Injectable()
export class HashtagRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async create(data: CreateHashtagDto) {
    const { name, slug } = data;
    const finalSlug = slug || this.generateSlug(name);

    const query = `
      INSERT INTO hashtags (name, slug)
      VALUES ($1, $2)
      RETURNING *
    `;
    return this.client.execute(query, [name, finalSlug]);
  }

  async update(data: UpdateHashtagDto) {
    const { tag_id, name, slug } = data;
    const finalSlug = slug || this.generateSlug(name);

    const query = `
      UPDATE hashtags
      SET name = $1, slug = $2
      WHERE tag_id = $3
      RETURNING *
    `;
    return this.client.execute(query, [name, finalSlug, tag_id]);
  }

  async delete(tagId: number) {
    const query = `
      DELETE FROM hashtags
      WHERE tag_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [tagId]);
  }

  async findById(tagId: number) {
    const query = `
      SELECT * FROM hashtags
      WHERE tag_id = $1
    `;
    return this.client.execute(query, [tagId]);
  }

  async findByName(name: string) {
    const query = `
      SELECT * FROM hashtags
      WHERE name = $1
    `;
    return this.client.execute(query, [name]);
  }

  async createIfNotExists(name: string) {
    const slug = this.generateSlug(name);

    const query = `
      INSERT INTO hashtags (name, slug)
      VALUES ($1, $2)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug
      RETURNING *
    `;
    return this.client.execute(query, [name, slug]);
  }

  async findAll(queryDto: QueryHashtagDto) {
    const { page = 1, limit = 10, search } = queryDto;
    const offset = (page - 1) * limit;

    const textSlug = this.generateSlug(search);

    let query = `
      SELECT * FROM hashtags
    `;

    const params = [];
    let paramIndex = 1;

    if (textSlug) {
      query += ` WHERE slug ILIKE $${paramIndex}`;
      params.push(`%${textSlug}%`);
      paramIndex++;
    }

    // Add count query
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_query`;

    // Add pagination
    query += ` ORDER BY tag_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const data = await this.client.execute(query, params);
    const count = await this.client.execute(
      countQuery,
      params.slice(0, paramIndex - 1),
    );

    return {
      data,
      total: count.rowCount,
    };
  }

  private generateSlug(name: string): string {
    return removeVietnameseAccents(name);
  }
}
