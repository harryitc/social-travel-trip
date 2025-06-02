module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."mini_blog_comments" (
    "mini_blog_comment_id" bigserial PRIMARY KEY,
    "message" varchar(255),
    "json_data" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "mini_blog_id" int8,
    "user_id" int8,
    "parent_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."mini_blog_comment_likes" (
    "created_at" timestamp(6),
    "mini_blog_comment_id" int8,
    "user_id" int8,
    "reaction_id" int default 1,
    PRIMARY KEY (mini_blog_comment_id, user_id)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."mini_blog_shareable" (
    "mini_blog_shareable_id" bigserial PRIMARY KEY,
    "title" varchar(255),
    "description" varchar(255),
    "is_show_map" bit,
    "is_show_timeline" bit,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "mini_blog_id" int8
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."mini_blogs" (
    "mini_blog_id" bigserial PRIMARY KEY,
    "title" varchar(255),
    "slug" varchar(255),
    "description" varchar(255),
    "day_travel" timestamp(6),
    "location" jsonb,
    "thumbnail_url" varchar(255),
    "json_data" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "user_id" int8
  );`);
};
