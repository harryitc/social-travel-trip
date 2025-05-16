import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';

@Injectable()
export class UserRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async getUserByID(userId) {
    const params = [userId];
    const query = `
    SELECT *
    FROM users
    WHERE user_id = $1
  `;
    return this.client.execute(query, params);
  }

  async getUserByUsername(username) {
    const params = [username];
    const query = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
    return this.client.execute(query, params);
  }

  async createUser(data) {
    const { username, password } = data;
    const params = [username, password];
    const query = `
    INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *
  `;
    return this.client.execute(query, params);
  }
}
