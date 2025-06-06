module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."mini_blog_shares" (
    "mini_blog_id" int8,
    "user_id" int8,
    "platform" varchar(50),
    "share_data" jsonb,
    "created_at" timestamp(6) WITHOUT TIME ZONE,
    PRIMARY KEY (mini_blog_id, user_id, platform)
  );`);
};
