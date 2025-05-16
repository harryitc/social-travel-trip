// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."post_comment_likes" (
    "comment_id" int8,
    "user_id" int8,
    "reaction_id" int default 1,
    PRIMARY KEY (comment_id, user_id)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."post_comments" (
    "post_comment_id" bigserial PRIMARY KEY,
    "content" varchar(255),
    "json_data" jsonb,
    "comment_shared_id" int8,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "parent_id" int8,
    "user_id" int8,
    "post_id" int8
  );`);
};
