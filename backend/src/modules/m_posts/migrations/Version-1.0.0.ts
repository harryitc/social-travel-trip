module.exports = async (client, schema) => {
  /**
   * Bảng post_likes: lượt like của người dùng cho bài viết
   * reaction_id: 1 - mặc định không like, 2 - like, 3 - love, 4 - haha, 5 - wow, 6 - sad
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."post_likes" (
    "user_id" int8,
    "post_id" int8,
    "reaction_id" int default 1,
    PRIMARY KEY (post_id, user_id)
  );`);

  /**
   * Bảng posts: bài viết của người dùng
   * json_data: lưu trữ các thông tin liên quan đến bài viết, bao gồm:
   *  - images: danh sách các hình ảnh
   *  - mentions: danh sách các người được tag trong bài viết
   *  - hashtags: danh sách các hashtag được sử dụng trong bài viết
   *  - location: địa điểm của bài viết (lon, lat, name, description)
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."posts" (
    "post_id" bigserial PRIMARY KEY,
    "content" varchar(255),
    "json_data" jsonb,
    "post_shared_id" int8,
    "is_hidden" bool,
    "created_at" timestamp(6) without timezone,
    "updated_at" timestamp(6) without timezone,
    "user_id" int8
  );`);
};
