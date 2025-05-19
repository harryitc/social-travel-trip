import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from '../dto/category.dto';
import { removeVietnameseAccents } from '@common/utils/string-utils';

@Injectable()
export class CategoryRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async create(data: CreateCategoryDto) {
    const { name, slug } = data;
    const finalSlug = slug || this.generateSlug(name);

    const query = `
      INSERT INTO categories (name, slug)
      VALUES ($1, $2)
      RETURNING *
    `;
    return this.client.execute(query, [name, finalSlug]);
  }

  async update(data: UpdateCategoryDto) {
    const { category_id, name, slug } = data;
    const finalSlug = slug || this.generateSlug(name);

    const query = `
      UPDATE categories
      SET name = $1, slug = $2
      WHERE category_id = $3
      RETURNING *
    `;
    return this.client.execute(query, [name, finalSlug, category_id]);
  }

  async delete(categoryId: number) {
    const query = `
      DELETE FROM categories
      WHERE category_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [categoryId]);
  }

  async findById(categoryId: number) {
    const query = `
      SELECT * FROM categories
      WHERE category_id = $1
    `;
    return this.client.execute(query, [categoryId]);
  }

  async findByName(name: string) {
    const query = `
      SELECT * FROM categories
      WHERE name = $1
    `;
    return this.client.execute(query, [name]);
  }

  async createIfNotExists(name: string) {
    const slug = this.generateSlug(name);

    const query = `
      INSERT INTO categories (name, slug)
      VALUES ($1, $2)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    return this.client.execute(query, [name, slug]);
  }

  async findAll(queryDto: QueryCategoryDto) {
    const { page = 1, limit = 10, search } = queryDto;
    const offset = (page - 1) * limit;

    const textSlug = this.generateSlug(search);

    let query = `
      SELECT * FROM categories
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
    query += ` ORDER BY category_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
