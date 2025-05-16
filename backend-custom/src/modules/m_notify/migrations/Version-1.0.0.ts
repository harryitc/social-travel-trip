module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."notifications" (
    "notify_id" bigserial PRIMARY KEY,
    "json_data" jsonb,
    "type" varchar(100)
    "is_read" bit
    "created_at" timestamp(6),
    "user_created" int8
  );`);
};
