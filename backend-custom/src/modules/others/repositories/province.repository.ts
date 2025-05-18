import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { CreateProvinceDto, QueryProvinceDto, UpdateProvinceDto } from '../dto/province.dto';

@Injectable()
export class ProvinceRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async create(data: CreateProvinceDto) {
    const { name } = data;
    const query = `
      INSERT INTO provinces (name)
      VALUES ($1)
      RETURNING *
    `;
    return this.client.execute(query, [name]);
  }

  async update(data: UpdateProvinceDto) {
    const { province_id, name } = data;
    const query = `
      UPDATE provinces
      SET name = $1
      WHERE province_id = $2
      RETURNING *
    `;
    return this.client.execute(query, [name, province_id]);
  }

  async delete(provinceId: number) {
    const query = `
      DELETE FROM provinces
      WHERE province_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [provinceId]);
  }

  async findById(provinceId: number) {
    const query = `
      SELECT * FROM provinces
      WHERE province_id = $1
    `;
    return this.client.execute(query, [provinceId]);
  }

  async findAll(queryDto: QueryProvinceDto) {
    const { page = 1, limit = 10, search } = queryDto;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM provinces
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` WHERE name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Add count query
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_query`;
    
    // Add pagination
    query += ` ORDER BY province_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const data = await this.client.execute(query, params);
    const count = await this.client.execute(countQuery, params.slice(0, paramIndex - 1));
    
    return {
      data,
      total: parseInt(count.rows[0].count),
    };
  }
}
