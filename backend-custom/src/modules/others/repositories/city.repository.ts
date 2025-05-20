import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { CreateCityDto, QueryCityDto, UpdateCityDto } from '../dto/city.dto';

@Injectable()
export class CityRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async create(data: CreateCityDto) {
    const { name, province_id } = data;
    const query = `
      INSERT INTO cities (name, province_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    return this.client.execute(query, [name, province_id]);
  }

  async update(data: UpdateCityDto) {
    const { city_id, name, province_id } = data;
    
    let query = `
      UPDATE cities
      SET 
    `;
    
    const params = [];
    let paramIndex = 1;
    const updates = [];
    
    if (name != undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }
    
    if (province_id != undefined) {
      updates.push(`province_id = $${paramIndex}`);
      params.push(province_id);
      paramIndex++;
    }
    
    if (updates.length == 0) {
      return { rowCount: 0, rows: [] };
    }
    
    query += updates.join(', ');
    query += ` WHERE city_id = $${paramIndex} RETURNING *`;
    params.push(city_id);
    
    return this.client.execute(query, params);
  }

  async delete(cityId: number) {
    const query = `
      DELETE FROM cities
      WHERE city_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [cityId]);
  }

  async findById(cityId: number) {
    const query = `
      SELECT c.*, p.name as province_name
      FROM cities c
      LEFT JOIN provinces p ON c.province_id = p.province_id
      WHERE c.city_id = $1
    `;
    return this.client.execute(query, [cityId]);
  }

  async findAll(queryDto: QueryCityDto) {
    const { page = 1, limit = 10, search, province_id } = queryDto;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT c.*, p.name as province_name
      FROM cities c
      LEFT JOIN provinces p ON c.province_id = p.province_id
    `;
    
    const params = [];
    let paramIndex = 1;
    const conditions = [];
    
    if (search) {
      conditions.push(`c.name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (province_id) {
      conditions.push(`c.province_id = $${paramIndex}`);
      params.push(province_id);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add count query
    const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_query`;
    
    // Add pagination
    query += ` ORDER BY c.city_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const data = await this.client.execute(query, params);
    const count = await this.client.execute(countQuery, params.slice(0, paramIndex - 1));
    
    return {
      data,
      total: parseInt(count.rows[0].count),
    };
  }
}
