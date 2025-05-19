import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { CreateReactionDto, QueryReactionDto, UpdateReactionDto } from '../dto/reaction.dto';

@Injectable()
export class ReactionRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async create(data: CreateReactionDto) {
    const { name } = data;
    const query = `
      INSERT INTO reactions (name)
      VALUES ($1)
      RETURNING *
    `;
    return this.client.execute(query, [name]);
  }

  async update(data: UpdateReactionDto) {
    const { reaction_id, name } = data;
    const query = `
      UPDATE reactions
      SET name = $1
      WHERE reaction_id = $2
      RETURNING *
    `;
    return this.client.execute(query, [name, reaction_id]);
  }

  async delete(reactionId: number) {
    const query = `
      DELETE FROM reactions
      WHERE reaction_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [reactionId]);
  }

  async findById(reactionId: number) {
    const query = `
      SELECT * FROM reactions
      WHERE reaction_id = $1
    `;
    return this.client.execute(query, [reactionId]);
  }

  async findAll(queryDto: QueryReactionDto) {
    const { page = 1, limit = 10, search } = queryDto;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT * FROM reactions
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
    query += ` ORDER BY reaction_id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const data = await this.client.execute(query, params);
    const count = await this.client.execute(countQuery, params.slice(0, paramIndex - 1));
    
    return {
      data,
      total: count.rowCount,
    };
  }
}
