module.exports = async (client, schema) => {
  /**
   * Bảng post_comment_likes: lượt like của người dùng cho bình luận
   * reaction_id: 1 - mặc định không like, 2 - like, 3 - love, 4 - haha, 5 - wow, 6 - sad
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."post_comment_likes" (
    "comment_id" int8,
    "user_id" int8,
    "reaction_id" int default 1,
    PRIMARY KEY (comment_id, user_id)
  );`);

  /**
   * Bảng post_comments: bình luận của người dùng cho bài viết
   * json_data: lưu trữ các thông tin liên quan đến bình luận, bao gồm:
   *  - images: danh sách các hình ảnh
   *  - mentions: danh sách các người được tag trong bình luận
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."post_comments" (
    "post_comment_id" bigserial PRIMARY KEY,
    "content" varchar(255),
    "json_data" jsonb,
    "comment_shared_id" int8,
    "created_at" timestamp(6) WITHOUT TIME ZONE,
    "updated_at" timestamp(6) WITHOUT TIME ZONE,
    "parent_id" int8,
    "user_id" int8,
    "post_id" int8
  );`);
};
