import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';

@Injectable()
export class PostRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  async getPosts(page = 1, limit = 10, userId?: number) {
    const offset = (page - 1) * limit;
    const params = [limit, offset];

    let query = `
    SELECT
      p.post_id,
      p.content,
      p.json_data,
      p.created_at,
      p.updated_at,
      p.user_id,
      u.username,
      u.full_name,
      u.avatar_url,
      (
        SELECT COUNT(*)
        FROM post_comments
        WHERE post_id = p.post_id
      ) AS comment_count,
      (
        SELECT json_agg(row)
        FROM (
          SELECT
            pl.reaction_id,
            COUNT(*) AS count
          FROM post_likes pl
          WHERE pl.post_id = p.post_id AND pl.reaction_id > 1
          GROUP BY pl.reaction_id
        ) AS row
      ) AS reactions`;

    // Add user reaction if userId is provided
    if (userId) {
      query += `,
      (
        SELECT pl.reaction_id
        FROM post_likes pl
        WHERE pl.post_id = p.post_id AND pl.user_id = $3
      ) AS user_reaction`;
      params.push(userId);
    }

    query += `
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `;

    return this.client.execute(query, params);
  }

  async getPostById(postId: number) {
    const query = `
    SELECT *
    FROM posts
    WHERE post_id = $1
  `;
    return this.client.execute(query, [postId]);
  }

  async getPostDetail(postId: number, userId?: number) {
    const params = [postId];

    let query = `
    SELECT
      p.post_id,
      p.content,
      p.json_data,
      p.created_at,
      p.updated_at,
      p.user_id,
      u.username,
      u.full_name,
      u.avatar_url,
      (
        SELECT COUNT(*)
        FROM post_comments
        WHERE post_id = p.post_id
      ) AS comment_count,
      (
        SELECT json_agg(row)
        FROM (
          SELECT
            pl.reaction_id,
            COUNT(*) AS count
          FROM post_likes pl
          WHERE pl.post_id = p.post_id AND pl.reaction_id > 1
          GROUP BY pl.reaction_id
        ) AS row
      ) AS reactions`;

    // Add user reaction if userId is provided
    if (userId) {
      query += `,
      (
        SELECT pl.reaction_id
        FROM post_likes pl
        WHERE pl.post_id = p.post_id AND pl.user_id = $2
      ) AS user_reaction`;
      params.push(userId);
    }

    query += `
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.user_id
    WHERE p.post_id = $1
  `;

    return this.client.execute(query, params);
  }
  async getCountPosts() {
    const params = [];
    const query = `
    SELECT COUNT(*)
    FROM posts p
  `;
    return this.client.execute(query, params);
  }

  async getLikePost(postId) {
    const query = `
    SELECT reaction_id, COUNT(*) AS count
    FROM post_likes
    WHERE post_id = $1 AND reaction_id > 1
    GROUP BY reaction_id
  `;
    return this.client.execute(query, [postId]);
  }

  async getPostReactionUsers(postId: number, reactionId?: number) {
    let query = `
    SELECT
      pl.user_id,
      pl.reaction_id,
      u.username,
      u.full_name,
      u.avatar_url
    FROM post_likes pl
    JOIN users u ON pl.user_id = u.user_id
    WHERE pl.post_id = $1 AND pl.reaction_id > 1
    `;

    const params = [postId];

    if (reactionId) {
      query += ` AND pl.reaction_id = $2`;
      params.push(reactionId);
    }

    return this.client.execute(query, params);
  }

  async updatePost(data) {
    const { postId, content, jsonData } = data;
    const params = [content, jsonData, postId];
    const query = `UPDATE posts
       SET content = COALESCE($1, content),
           json_data = COALESCE($2, json_data),
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $3
       RETURNING *`;

    return this.client.execute(query, params);
  }

  async createPost(data, userId) {
    const { content, mentions, hashtags, location, images, jsonData } = data;

    // Prepare JSON data with all the new fields
    const postJsonData = {
      ...(jsonData || {}),
      ...(mentions && { mentions }),
      ...(hashtags && { hashtags }),
      ...(location && { location }),
      ...(images && { images }),
    };

    const params = [content, postJsonData, userId];
    const query = `
    INSERT INTO posts (content, json_data, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `;
    return this.client.execute(query, params);
  }

  async likePost(data, userId) {
    const { postId, reactionId } = data;

    const query = `
    INSERT INTO post_likes (post_id, user_id, reaction_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (post_id, user_id)
    DO UPDATE SET reaction_id = EXCLUDED.reaction_id
  `;

    return this.client.execute(query, [postId, userId, reactionId]);
  }

  /**
   * Get users who have interacted with a post (liked or commented)
   * @param postId Post ID
   * @returns Array of user IDs who have interacted with the post
   */
  async getPostInterestedUsers(postId: number) {
    const query = `
    SELECT DISTINCT user_id
    FROM (
      -- Users who liked the post
      SELECT user_id
      FROM post_likes
      WHERE post_id = $1 AND reaction_id > 1

      UNION

      -- Users who commented on the post
      SELECT user_id
      FROM post_comments
      WHERE post_id = $1
    ) AS interested_users
    `;

    return this.client.execute(query, [postId]);
  }

  /**
    Trường họp transaction update nhiều dòng tên 1 bảng,
    hoặc có thể dùng pg-format để insert nhiều dòng trong 1 bảng cho 1 lần query (khong dung transaction)
    Ví dụ về postgres format để insert nhiều dòng dữ liệu cho 1 lần query:
    ...
    updateManyTransaction(data: Array<any>) {
      // Logic map your data to nested array.
      const myNestedArray = [['a', 1], ['b', 2]];
      const queryString = format('INSERT INTO tableName (name, age) VALUES %L', myNestedArray);
      reutrn this.client.query(queryString);
    }
  */
  /**
  updateManyTransaction(data: Array<any>) {
    return this.client.transaction(async (client: PoolClient) => {
      for (const item of data) {
        await client.query(`
          UPDATE posts
          SET info = info || jsonb_set(
              jsonb_set(info, $1, $2, true),
              $3, $4, true
            )
          WHERE id = $5
            `,
          [
            ['images', 'anh_dai_dien'], // $1
            JSON.stringify(item.info.images.anh_dai_dien), // $2
            '{description}', // $3
            JSON.stringify(item.info.description),
            item.id,
          ],
        );
      }
    });
  }

  /**
    Trường họp transaction update dữ liệu trên 2 hay nhiều bảng
  */
  /**
  insertProductAndDefaultVariant(
    product: {
      info: any;
      currentStatus: any;
      key: any;
      publicTime: any;
    },
    variant: {
      info: any;
      currentStatus: any;
      isDefault: any;
      publicTime: any;
    },
  ) {
    return this.client.transaction(async (client: PoolClient) => {
      // About transaction iso: https://www.postgresql.org/docs/current/transaction-iso.html
      await client.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`);

      // Execute your query ...
      const productResult = await client.query(
        `INSERT INTO posts(info, current_status, key, public_time)
         VALUES($1, $2, $3, $4) RETURNING *`,
        [product.info, product.currentStatus, product.key, product.publicTime],
      );

      const productId = productResult.rows[0].id;

      // Insert default variant
      await client.query(
        `INSERT INTO ec_variants(info, current_status, is_default, public_time, id)
         VALUES($1, $2, $3, $4, $5)`,
        [
          variant.info,
          variant.currentStatus,
          variant.isDefault,
          variant.publicTime,
          productId,
        ],
      );
    });
  }
  */
}
