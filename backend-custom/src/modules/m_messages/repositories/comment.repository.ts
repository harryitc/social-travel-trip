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
      c.user_id,
      c.created_at,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', r.post_comment_id,
              'content', r.content,
              'user_id', r.user_id,
              'created_at', r.created_at
            ) ORDER BY r.created_at
          )
          FROM post_comments r
          WHERE r.parent_id = c.post_comment_id
        ), '[]'
      ) AS replies
    FROM post_comments c
    WHERE c.post_id = $1 AND c.parent_id IS NULL
    ORDER BY c.created_at
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
    WHERE comment_id = $1 AND reaction_id != 1
    GROUP BY reaction_id
  `;
    return this.client.execute(query, [commentId]);
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
