module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."user_rela" (
    "user_rela_id" bigserial PRIMARY KEY,
    "user_id" int8 NOT NULL,
    "following" int8 NOT NULL,
    "created_at" timestamp DEFAULT NOW(),
    UNIQUE("user_id", "following")
  );`);
};
