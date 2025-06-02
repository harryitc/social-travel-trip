import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import {
  UpdateProfileStatsDTO,
  ProfileViewDTO,
} from '../dto/profile-stats.dto';

@Injectable()
export class ProfileStatsRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async getProfileStats(userId: number) {
    const params = [userId];
    const query = `
    SELECT *
    FROM profile_stats
    WHERE user_id = $1
    `;
    return this.client.execute(query, params);
  }

  async createProfileStats(userId: number, completionPercentage: number = 0) {
    const params = [
      userId,
      completionPercentage,
      0, // profile_views
      0, // posts_count
      0, // followers_count
      0, // following_count
      0, // groups_count
      0, // trips_count
      new Date(), // last_active
      new Date(), // created_at
      new Date(), // updated_at
    ];

    // Check if stats already exist
    const existingStats = await this.getProfileStats(userId);
    if (existingStats.rowCount > 0) {
      // Update existing stats
      const updateQuery = `
      UPDATE profile_stats
      SET
        completion_percentage = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
      `;
      return this.client.execute(updateQuery, [userId, completionPercentage]);
    }

    const query = `
    INSERT INTO profile_stats (
      user_id,
      completion_percentage,
      profile_views,
      posts_count,
      followers_count,
      following_count,
      groups_count,
      trips_count,
      last_active,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async updateProfileStats(data: UpdateProfileStatsDTO) {
    const {
      user_id,
      completion_percentage,
      profile_views,
      posts_count,
      followers_count,
      following_count,
      groups_count,
      trips_count,
    } = data;

    // Build dynamic update query
    const updateFields = [];
    const params = [user_id];
    let paramIndex = 2;

    if (completion_percentage !== undefined) {
      updateFields.push(`completion_percentage = $${paramIndex}`);
      params.push(completion_percentage);
      paramIndex++;
    }

    if (profile_views !== undefined) {
      updateFields.push(`profile_views = $${paramIndex}`);
      params.push(profile_views);
      paramIndex++;
    }

    if (posts_count !== undefined) {
      updateFields.push(`posts_count = $${paramIndex}`);
      params.push(posts_count);
      paramIndex++;
    }

    if (followers_count !== undefined) {
      updateFields.push(`followers_count = $${paramIndex}`);
      params.push(followers_count);
      paramIndex++;
    }

    if (following_count !== undefined) {
      updateFields.push(`following_count = $${paramIndex}`);
      params.push(following_count);
      paramIndex++;
    }

    if (groups_count !== undefined) {
      updateFields.push(`groups_count = $${paramIndex}`);
      params.push(groups_count);
      paramIndex++;
    }

    if (trips_count !== undefined) {
      updateFields.push(`trips_count = $${paramIndex}`);
      params.push(trips_count);
      paramIndex++;
    }

    // Always update last_active and updated_at
    updateFields.push(`last_active = CURRENT_TIMESTAMP`);
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 2) {
      // Only updating timestamps, no actual data changes
      return this.getProfileStats(user_id);
    }

    const query = `
    UPDATE profile_stats
    SET ${updateFields.join(', ')}
    WHERE user_id = $1
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async incrementProfileViews(userId: number) {
    const params = [userId];
    const query = `
    UPDATE profile_stats
    SET 
      profile_views = profile_views + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async recordProfileView(data: ProfileViewDTO) {
    const { viewer_id, profile_owner_id } = data;

    // Check if view already exists for today
    const checkQuery = `
    SELECT view_id FROM profile_views
    WHERE viewer_id = $1 AND profile_owner_id = $2
    AND DATE(viewed_at) = CURRENT_DATE
    `;
    const existingView = await this.client.execute(checkQuery, [
      viewer_id,
      profile_owner_id,
    ]);

    if (existingView.rowCount > 0) {
      // Update existing view
      const updateQuery = `
      UPDATE profile_views
      SET viewed_at = CURRENT_TIMESTAMP
      WHERE viewer_id = $1 AND profile_owner_id = $2
      AND DATE(viewed_at) = CURRENT_DATE
      RETURNING *
      `;
      return this.client.execute(updateQuery, [viewer_id, profile_owner_id]);
    }

    // Insert new view
    const params = [viewer_id, profile_owner_id, new Date()];
    const query = `
    INSERT INTO profile_views (viewer_id, profile_owner_id, viewed_at)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async getRecentProfileViews(userId: number, limit: number = 10) {
    const params = [userId, limit];
    const query = `
    SELECT 
      pv.*,
      u.username,
      u.full_name,
      u.avatar_url
    FROM profile_views pv
    JOIN users u ON pv.viewer_id = u.user_id
    WHERE pv.profile_owner_id = $1
    ORDER BY pv.viewed_at DESC
    LIMIT $2
    `;

    return this.client.execute(query, params);
  }

  async getProfileStatsWithCounts(userId: number) {
    const params = [userId];
    const query = `
    SELECT
      ps.*,
      COALESCE((SELECT COUNT(*) FROM posts WHERE user_id = $1), 0) as actual_posts_count,
      COALESCE((SELECT COUNT(*) FROM user_relationships WHERE followed_id = $1 AND status = 'accepted'), 0) as actual_followers_count,
      COALESCE((SELECT COUNT(*) FROM user_relationships WHERE follower_id = $1 AND status = 'accepted'), 0) as actual_following_count,
      COALESCE((SELECT COUNT(*) FROM group_members WHERE user_id = $1 AND status = 'active'), 0) as actual_groups_count
    FROM profile_stats ps
    WHERE ps.user_id = $1
    `;

    return this.client.execute(query, params);
  }
}
