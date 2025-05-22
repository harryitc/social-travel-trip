import { Injectable } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';

@Injectable()
export class CommentRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  /**
   * Lấy danh sách bình luận theo bài viết
   */
  async getComments(postId: number) {
    const query = `
    SELECT
      c.post_comment_id AS id,
      c.content,
      c.json_data,
      c.user_id,
      c.created_at,
      u.username,
      u.full_name,
      u.avatar_url,
      (
        SELECT json_agg(json_build_object(
          'reaction_id', cl.reaction_id,
          'count', COUNT(*)
        ))
        FROM post_comment_likes cl
        WHERE cl.comment_id = c.post_comment_id AND cl.reaction_id > 1
        GROUP BY cl.comment_id
      ) AS reactions,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', r.post_comment_id,
              'content', r.content,
              'json_data', r.json_data,
              'user_id', r.user_id,
              'username', ru.username,
              'full_name', ru.full_name,
              'avatar_url', ru.avatar_url,
              'created_at', r.created_at,
              'reactions', (
                SELECT json_agg(json_build_object(
                  'reaction_id', rcl.reaction_id,
                  'count', COUNT(*)
                ))
                FROM post_comment_likes rcl
                WHERE rcl.comment_id = r.post_comment_id AND rcl.reaction_id > 1
                GROUP BY rcl.comment_id
              )
            ) ORDER BY r.created_at
          )
          FROM post_comments r
          LEFT JOIN users ru ON r.user_id = ru.user_id
          WHERE r.parent_id = c.post_comment_id
        ), '[]'
      ) AS replies
    FROM post_comments c
    LEFT JOIN users u ON c.user_id = u.user_id
    WHERE c.post_id = $1 AND c.parent_id IS NULL
    ORDER BY c.created_at DESC
  `;
    const params = [postId];
    return this.client.execute(query, params);
  }

  // async getCountComments(postId: number) {
  //   const query = `
  //   SELECT COUNT(c.*)
  //   FROM post_comments c
  //   WHERE c.post_id = $1 AND c.parent_id IS NULL
  // `;
  //   const params = [postId];
  //   return this.client.execute(query, params);
  // }

  /**
   * Tạo bình luận
   */
  async createComment(data, userId) {
    const { content, jsonData, postId, parentId } = data;

    const query = `
    INSERT INTO post_comments (content, json_data, post_id, user_id, parent_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *
  `;

    const params = [content, jsonData, postId, userId, parentId ?? null];
    return this.client.execute(query, params);
  }

  /**
   * Reply bình luận (bình luận con)
   */
  async replyComment(data, userId) {
    const { content, jsonData, postId, parentId } = data;
    const query = `
    INSERT INTO post_comments (content, json_data, post_id, parent_id, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *
  `;
    return this.client.execute(query, [
      content,
      jsonData,
      postId,
      parentId,
      userId,
    ]);
  }

  /**
   * Like bình luận
   */
  async likeComment(data, userId) {
    const { commentId, reactionId } = data;

    const query = `
    INSERT INTO post_comment_likes (comment_id, user_id, reaction_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (comment_id, user_id)
    DO UPDATE SET reaction_id = EXCLUDED.reaction_id
  `;

    return this.client.execute(query, [commentId, userId, reactionId]);
  }

  async getLikeComments(commentId) {
    const query = `
    SELECT reaction_id, COUNT(*) AS count
    FROM post_comment_likes
    WHERE comment_id = $1 AND reaction_id > 1
    GROUP BY reaction_id
  `;
    return this.client.execute(query, [commentId]);
  }

  async getCommentReactionUsers(commentId: number, reactionId?: number) {
    let query = `
    SELECT
      cl.user_id,
      cl.reaction_id,
      u.username,
      u.full_name,
      u.avatar_url
    FROM post_comment_likes cl
    JOIN users u ON cl.user_id = u.user_id
    WHERE cl.comment_id = $1 AND cl.reaction_id > 1
    `;

    const params = [commentId];

    if (reactionId) {
      query += ` AND cl.reaction_id = $2`;
      params.push(reactionId);
    }

    query += ` ORDER BY u.full_name`;

    return this.client.execute(query, params);
  }

  /**
   * Get a comment by ID
   */
  async getCommentById(commentId: number) {
    const query = `
    SELECT *
    FROM post_comments
    WHERE post_comment_id = $1
  `;
    return this.client.execute(query, [commentId]);
  }

  /**
   * Get users who have participated in a comment thread (commented on the same post)
   * @param postId Post ID
   * @returns Array of user IDs who have commented on the post
   */
  async getCommentThreadParticipants(postId: number) {
    const query = `
    SELECT DISTINCT user_id
    FROM post_comments
    WHERE post_id = $1
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
