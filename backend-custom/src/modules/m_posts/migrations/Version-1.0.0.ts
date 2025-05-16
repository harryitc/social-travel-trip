// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."post_likes" (
    "user_id" int8,
    "post_id" int8,
    "reaction_id" int default 1,
    PRIMARY KEY (post_id, user_id)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."posts" (
    "post_id" bigserial PRIMARY KEY,
    "content" varchar(255),
    "json_data" jsonb,
    "post_shared_id" int8,
    "is_hidden" bool,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "user_id" int8,
    "place_id" int8
  );`);
};
