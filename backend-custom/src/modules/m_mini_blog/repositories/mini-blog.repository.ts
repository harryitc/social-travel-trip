import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';

@Injectable()
export class MiniBlogRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  /**
   * Get comments by mini blog ID
   */
  async getCommentsByMiniBlogId(miniBlogId: number) {
    const query = `
    SELECT
      c.mini_blog_comment_id AS id,
      c.message,
      c.json_data,
      c.user_id,
      c.created_at,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', r.mini_blog_comment_id,
              'message', r.message,
              'json_data', r.json_data,
              'user_id', r.user_id,
              'created_at', r.created_at
            ) ORDER BY r.created_at
          )
          FROM mini_blog_comments r
          WHERE r.parent_id = c.mini_blog_comment_id
        ), '[]'
      ) AS replies
    FROM mini_blog_comments c
    WHERE c.mini_blog_id = $1 AND c.parent_id IS NULL
    ORDER BY c.created_at DESC
  `;
    const params = [miniBlogId];
    return this.client.execute(query, params);
  }

  /**
   * Create a comment on a mini blog
   */
  async createComment(data: any, userId: number) {
    const { miniBlogId, parentId, message, jsonData } = data;

    const query = `
    INSERT INTO mini_blog_comments (message, json_data, mini_blog_id, user_id, parent_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *
  `;

    const params = [message, jsonData, miniBlogId, userId, parentId ?? null];
    return this.client.execute(query, params);
  }

  /**
   * Reply to a comment on a mini blog
   */
  async replyComment(data: any, userId: number) {
    const { miniBlogId, parentId, message, jsonData } = data;
    const query = `
    INSERT INTO mini_blog_comments (message, json_data, mini_blog_id, parent_id, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *
  `;
    return this.client.execute(query, [
      message,
      jsonData,
      miniBlogId,
      parentId,
      userId,
    ]);
  }

  /**
   * Like a mini blog
   */
  async likeMiniBlog(data: any, userId: number) {
    const { miniBlogId, reactionId } = data;

    const query = `
    INSERT INTO mini_blog_likes (mini_blog_id, user_id, reaction_id, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (mini_blog_id, user_id)
    DO UPDATE SET reaction_id = EXCLUDED.reaction_id, created_at = NOW()
    RETURNING *
  `;

    return this.client.execute(query, [miniBlogId, userId, reactionId || 1]);
  }

  /**
   * Like a comment on a mini blog
   */
  async likeComment(data: any, userId: number) {
    const { commentId, reactionId } = data;

    const query = `
    INSERT INTO mini_blog_comment_likes (mini_blog_comment_id, user_id, reaction_id, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (mini_blog_comment_id, user_id)
    DO UPDATE SET reaction_id = EXCLUDED.reaction_id, created_at = NOW()
    RETURNING *
  `;

    return this.client.execute(query, [commentId, userId, reactionId || 1]);
  }

  /**
   * Get likes for a mini blog
   */
  async getLikesByMiniBlogId(miniBlogId: number) {
    const query = `
    SELECT reaction_id, COUNT(*) AS count
    FROM mini_blog_likes
    WHERE mini_blog_id = $1
    GROUP BY reaction_id
  `;
    return this.client.execute(query, [miniBlogId]);
  }

  /**
   * Get likes for a comment on a mini blog
   */
  async getLikesByCommentId(commentId: number) {
    const query = `
    SELECT reaction_id, COUNT(*) AS count
    FROM mini_blog_comment_likes
    WHERE mini_blog_comment_id = $1
    GROUP BY reaction_id
  `;
    return this.client.execute(query, [commentId]);
  }

  /**
   * Get a comment by ID
   */
  async getCommentById(commentId: number) {
    const query = `
    SELECT *
    FROM mini_blog_comments
    WHERE mini_blog_comment_id = $1
  `;
    return this.client.execute(query, [commentId]);
  }

  async getMiniBlogList(filters = {}) {
    const params = [];
    const query = `
      SELECT *
      FROM mini_blogs mb
      ORDER BY mb.created_at DESC
    `;
    return this.client.execute(query, params);
  }

  async getCountMiniBlog() {
    const params = [];
    const query = `
      SELECT COUNT(*)
      FROM mini_blogs mb
    `;
    return this.client.execute(query, params);
  }

  async getMiniBlogById(miniBlogId: number) {
    const query = `
      SELECT *
      FROM mini_blogs
      WHERE mini_blog_id = $1
    `;
    return this.client.execute(query, [miniBlogId]);
  }

  async createMiniBlog(data, userId) {
    const {
      title,
      slug,
      description,
      dayTravel,
      location,
      thumbnailUrl,
      jsonData,
    } = data;
    const params = [
      title,
      slug,
      description,
      dayTravel,
      location,
      thumbnailUrl,
      jsonData,
      userId,
    ];
    const query = `
      INSERT INTO mini_blogs (title, slug, description, day_travel, location, thumbnail_url, json_data, created_at, updated_at, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8)
      RETURNING *
    `;
    return this.client.execute(query, params);
  }

  async updateMiniBlog(data) {
    const {
      miniBlogId,
      title,
      slug,
      description,
      dayTravel,
      location,
      thumbnailUrl,
      jsonData,
    } = data;
    const params = [
      title,
      slug,
      description,
      dayTravel,
      location,
      thumbnailUrl,
      jsonData,
      miniBlogId,
    ];
    const query = `
      UPDATE mini_blogs
      SET title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          day_travel = COALESCE($4, day_travel),
          location = COALESCE($5, location),
          thumbnail_url = COALESCE($6, thumbnail_url),
          json_data = COALESCE($7, json_data),
          updated_at = NOW()
      WHERE mini_blog_id = $8
      RETURNING *
    `;
    return this.client.execute(query, params);
  }

  async deleteMiniBlog(miniBlogId: number) {
    const query = `
      DELETE FROM mini_blogs
      WHERE mini_blog_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [miniBlogId]);
  }

  async shareMiniBlog(
    miniBlogId: number,
    platform: string,
    shareData: any,
    userId: number,
  ) {
    const params = [miniBlogId, platform, shareData, userId];
    const query = `
      INSERT INTO mini_blog_shares (mini_blog_id, platform, share_data, created_at, user_id)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *
    `;
    return this.client.execute(query, params);
  }

  async createShareLink(data) {
    const { miniBlogId, title, description, isShowMap, isShowTimeline } = data;
    const params: any = [title, description, isShowMap ? '1' : '0', isShowTimeline ? '1' : '0', miniBlogId];
    const query = `
      INSERT INTO mini_blog_shareable (title, description, is_show_map, is_show_timeline, created_at, updated_at, mini_blog_id)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)
      RETURNING *
    `;
    return this.client.execute(query, params);
  }

  async updateShareInfo(data) {
    const {
      miniBlogShareableId,
      title,
      description,
      isShowMap,
      isShowTimeline,
    } = data;

    const parseToBit = (val) => {
      if (val === true || val === 1 || val === '1') return '1';
      if (val === false || val === 0 || val === '0') return '0';
      return null; // hoặc throw new Error('Invalid bit value') nếu muốn bắt lỗi
    };

    const safeIsShowMap = parseToBit(isShowMap);
    const safeIsShowTimeline = parseToBit(isShowTimeline);

    const params = [
      title,
      description,
      safeIsShowMap,
      safeIsShowTimeline,
      miniBlogShareableId,
    ];

    const query = `
    UPDATE mini_blog_shareable
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        is_show_map = COALESCE($3, is_show_map),
        is_show_timeline = COALESCE($4, is_show_timeline),
        updated_at = NOW()
    WHERE mini_blog_shareable_id = $5
    RETURNING *
  `;

    return this.client.execute(query, params);
  }

  async getSharesList(miniBlogId: number) {
    const query = `
      SELECT *
      FROM mini_blog_shareable
      WHERE mini_blog_id = $1
      ORDER BY created_at DESC
    `;
    return this.client.execute(query, [miniBlogId]);
  }

  async deleteShareLink(miniBlogShareableId: number) {
    const query = `
      DELETE FROM mini_blog_shareable
      WHERE mini_blog_shareable_id = $1
      RETURNING *
    `;
    return this.client.execute(query, [miniBlogShareableId]);
  }

  async deleteMiniBlogWithShares(miniBlogId: number) {
    // First delete all shares
    await this.client.execute(
      `
      DELETE FROM mini_blog_shareable
      WHERE mini_blog_id = $1
    `,
      [miniBlogId],
    );

    // Then delete the blog
    return this.client.execute(
      `
      DELETE FROM mini_blogs
      WHERE mini_blog_id = $1
      RETURNING *
    `,
      [miniBlogId],
    );
  }
}
