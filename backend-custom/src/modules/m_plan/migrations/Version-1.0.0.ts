// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plan_places" (
    "plan_place_id" bigserial PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "schedules" jsonb,
    "location" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "plan_travel_day_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plan_travel_days" (
    "plan_travel_day_id" bigserial PRIMARY KEY,
    "ngay" varchar(32),
    "plan_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plans" (
    "plan_id" bigserial PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "thumbnail_url" varchar(255),
    "day_travel" int4,
    "json_data" jsonb,
    "location" jsonb,
    "status" varchar(255),
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "user_id" int8
  );`);
};
