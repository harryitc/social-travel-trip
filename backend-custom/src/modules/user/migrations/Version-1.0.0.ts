// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."users" (
    "user_id" bigserial PRIMARY KEY,
    "username" varchar(255) UNIQUE NOT NULL,
    "password" TEXT NOT NULL
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."user_rela" (
    "user_rela_id" bigserial PRIMARY KEY,
    "user_id" int8,
    "following" int8
  );`);
};
