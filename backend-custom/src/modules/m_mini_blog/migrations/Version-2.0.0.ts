module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."mini_blog_likes" (
    "created_at" timestamp(6),
    "mini_blog_id" int8,
    "user_id" int8,
    "reaction_id" int default 1,
    PRIMARY KEY (mini_blog_id, user_id)
  );`);
};
