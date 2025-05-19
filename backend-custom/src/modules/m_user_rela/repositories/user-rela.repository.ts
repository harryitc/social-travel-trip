import { Injectable, NotFoundException } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { GetFollowersDto } from '../dto/get-followers.dto';
import { GetFollowingDto } from '../dto/get-following.dto';

@Injectable()
export class UserRelaRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  // Check if user exists
  async checkUserExists(userId: number) {
    const query = `
      SELECT user_id FROM users
      WHERE user_id = $1
    `;

    return this.client.execute(query, [userId]);
  }

  // Follow a user
  async followUser(userId: number, followingId: number) {
    // First check if the user to follow exists
    const userExists = await this.checkUserExists(followingId);
    if (userExists.rowCount === 0) {
      throw new NotFoundException(`User with ID ${followingId} not found`);
    }

    const query = `
      INSERT INTO user_rela (
        user_id, following
      )
      VALUES ($1, $2)
      ON CONFLICT (user_id, following) DO NOTHING
      RETURNING *
    `;

    return this.client.execute(query, [userId, followingId]);
  }

  // Unfollow a user
  async unfollowUser(userId: number, followingId: number) {
    const query = `
      DELETE FROM user_rela
      WHERE user_id = $1 AND following = $2
      RETURNING *
    `;

    return this.client.execute(query, [userId, followingId]);
  }

  // Check if a user is following another user
  async checkFollowStatus(userId: number, followingId: number) {
    const query = `
      SELECT * FROM user_rela
      WHERE user_id = $1 AND following = $2
    `;

    return this.client.execute(query, [userId, followingId]);
  }

  // Get followers list with pagination
  async getFollowers(dto: GetFollowersDto, currentUserId: number) {
    const userId = currentUserId;
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT ur.*, u.username, u.full_name, u.avatar_url
      FROM user_rela ur
      JOIN users u ON ur.user_id = u.user_id
      WHERE ur.following = $1
      ORDER BY ur.user_rela_id DESC
      LIMIT $2 OFFSET $3
    `;

    return this.client.execute(query, [userId, limit, offset]);
  }

  // Count total followers
  async countFollowers(userId: number) {
    const query = `
      SELECT COUNT(*) as total
      FROM user_rela
      WHERE following = $1
    `;

    return this.client.execute(query, [userId]);
  }

  // Get following list with pagination
  async getFollowing(dto: GetFollowingDto, currentUserId: number) {
    const userId = currentUserId;
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT ur.*, u.username, u.full_name, u.avatar_url
      FROM user_rela ur
      JOIN users u ON ur.following = u.user_id
      WHERE ur.user_id = $1
      ORDER BY ur.user_rela_id DESC
      LIMIT $2 OFFSET $3
    `;

    return this.client.execute(query, [userId, limit, offset]);
  }

  // Count total following
  async countFollowing(userId: number) {
    const query = `
      SELECT COUNT(*) as total
      FROM user_rela
      WHERE user_id = $1
    `;

    return this.client.execute(query, [userId]);
  }

  // Get all followers of a user (without pagination)
  async getAllFollowers(userId: number) {
    const query = `
      SELECT ur.user_id, u.username, u.full_name
      FROM user_rela ur
      JOIN users u ON ur.user_id = u.user_id
      WHERE ur.following = $1
    `;

    return this.client.execute(query, [userId]);
  }
}
