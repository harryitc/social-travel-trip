// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."group_members" (
    "group_member_id" bigserial PRIMARY KEY,
    "nickname" varchar(100),
    "role" varchar(50),
    "join_at" timestamp(6),
    "group_id" int8,
    "user_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."group_messages" (
    "group_message_id" bigserial PRIMARY KEY,
    "message" text,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "group_id" int8,
    "user_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."groups" (
    "group_id" bigserial PRIMARY KEY,
    "name" varchar(100),
    "description" varchar(255),
    "cover_url" varchar(255),
    "status" varchar(50),
    "json_data" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "plan_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."message_likes" (
    "created_at" timestamp(6),
    "reaction_id" int8,
    "group_message_id" int8,
    "user_id" int8,
    PRIMARY KEY (group_message_id, user_id)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."message_pins" (
    "message_pin_id" bigserial PRIMARY KEY,
    "created_at" timestamp(6),
    "group_message_id" int8,
    "group_id" int8,
    "user_id" int8
  );`);
};
