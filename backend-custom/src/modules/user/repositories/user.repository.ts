import { Injectable, NotFoundException } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { CreateUserDTO, UpdateUserDTO, SearchUserDTO } from '../dto/user.dto';
import { removeVietnameseAccents } from '@common/utils/string-utils';

@Injectable()
export class UserRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async getUserByID(userId: number) {
    const params = [userId];
    const query = `
    SELECT *
    FROM users
    WHERE user_id = $1
    `;
    return this.client.execute(query, params);
  }

  async getUserByUsername(username: string) {
    const params = [username];
    const query = `
    SELECT *
    FROM users
    WHERE username = $1
    `;
    return this.client.execute(query, params);
  }

  async createUser(data: CreateUserDTO) {
    const {
      username,
      password,
      full_name,
      email,
      phone_number,
      date_of_birth,
      gender,
      address,
      avatar_url,
    } = data;

    // Create json_data with ho_ten_khong_dau for search
    const jsonData = {
      ho_ten_khong_dau: full_name ? removeVietnameseAccents(full_name) : null,
    };

    const params = [
      username,
      password,
      full_name || null,
      email || null,
      phone_number || null,
      date_of_birth || null,
      gender !== undefined && gender !== null ? (gender ? '1' : '0') : null,
      address || null,
      avatar_url || null,
      JSON.stringify(jsonData),
      new Date(),
      new Date(),
    ];

    const query = `
    INSERT INTO users (
      username,
      password,
      full_name,
      email,
      phone_number,
      date_of_birth,
      gender,
      address,
      avatar_url,
      json_data,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7::bit, $8, $9, $10, $11, $12)
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async updateUser(data: UpdateUserDTO) {
    const {
      user_id,
      full_name,
      email,
      phone_number,
      date_of_birth,
      gender,
      address,
      avatar_url,
    } = data;

    // Get current user data to merge json_data
    const currentUser = await this.getUserByID(user_id);
    if (currentUser.rowCount == 0) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Update json_data with ho_ten_khong_dau if full_name is provided
    let jsonData = currentUser.rows[0].json_data || {};
    if (typeof jsonData == 'string') {
      jsonData = JSON.parse(jsonData);
    }

    if (full_name) {
      jsonData.ho_ten_khong_dau = removeVietnameseAccents(full_name);
    }

    const params = [
      full_name || null,
      email || null,
      phone_number || null,
      date_of_birth || null,
      gender !== undefined && gender !== null ? (gender ? '1' : '0') : null,
      address || null,
      avatar_url || null,
      JSON.stringify(jsonData),
      new Date(),
      user_id,
    ];

    const query = `
    UPDATE users
    SET
      full_name = COALESCE($1, full_name),
      email = COALESCE($2, email),
      phone_number = COALESCE($3, phone_number),
      date_of_birth = COALESCE($4, date_of_birth),
      gender = COALESCE($5::bit, gender),
      address = COALESCE($6, address),
      avatar_url = COALESCE($7, avatar_url),
      json_data = $8,
      updated_at = $9
    WHERE user_id = $10
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async changePassword(userId: number, newPassword: string) {
    const params = [newPassword, userId];
    const query = `
    UPDATE users
    SET
      password = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async searchUsers(searchDTO: SearchUserDTO) {
    const {
      search_term,
      page = 1,
      limit = 10,
      autocomplete = false,
    } = searchDTO;
    const offset = (page - 1) * limit;

    const params = [];
    let whereClause = '';

    if (search_term) {
      params.push(`%${search_term}%`);
      params.push(`%${removeVietnameseAccents(search_term)}%`);
      whereClause = `
        WHERE
          username ILIKE $1
          OR full_name ILIKE $1
          OR (json_data->>'ho_ten_khong_dau')::text ILIKE $2
      `;
    }

    params.push(limit, offset);

    // For autocomplete, return minimal fields for better performance
    const selectFields = autocomplete
      ? `user_id, username, full_name, avatar_url`
      : `user_id, username, full_name, email, phone_number, date_of_birth, gender, address, avatar_url, json_data, created_at, updated_at`;

    const query = `
    SELECT ${selectFields}
    FROM users
    ${whereClause}
    ORDER BY
      CASE
        WHEN username ILIKE $1 THEN 1
        WHEN full_name ILIKE $1 THEN 2
        ELSE 3
      END,
      created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const countQuery = `
    SELECT COUNT(*) as total
    FROM users
    ${whereClause}
    `;

    const result = await this.client.execute(query, params);

    // For autocomplete, skip count query for better performance
    if (autocomplete) {
      return {
        data: result.rows,
        total: result.rows.length,
      };
    }

    const countResult = await this.client.execute(
      countQuery,
      params.slice(0, -2),
    );

    return {
      data: result.rows,
      total: countResult.rowCount,
      // page,
      // limit,
      // totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
    };
  }

  async deleteUser(userId: number) {
    const params = [userId];
    const query = `
    DELETE FROM users
    WHERE user_id = $1
    RETURNING *
    `;

    return this.client.execute(query, params);
  }
}
