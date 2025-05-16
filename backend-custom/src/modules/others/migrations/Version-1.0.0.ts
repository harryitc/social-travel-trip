// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."hashtags" (
    "tag_id" bigserial PRIMARY KEY,
    "name" varchar(100)
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."activities" (
    "activity_id" bigserial PRIMARY KEY,
    "name" varchar(255)
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."activity_settings" (
    "activity_setting_id" bigserial PRIMARY KEY,
    "description" varchar(255),
    "json_data" jsonb,
    "activity_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."catetory" (
    "category_id" bigserial PRIMARY KEY,
    "name" varchar(255)
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."cities" (
    "city_id" bigserial PRIMARY KEY,
    "name" varchar(100),
    "province_id" int8
  );`);

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
    "day_travel" timestamp(255),
    "location" jsonb,
    "thumbnail_url" varchar(255),
    "json_data" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "user_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."notifications" (
    "notify_id" bigserial PRIMARY KEY,
    "json_data" jsonb,
    "type" varchar(100),
    "is_read" bit,
    "created_at" timestamp(6),
    "user_created" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."place_reviews" (
    "place_review_id" bigserial PRIMARY KEY,
    "content" varchar(255),
    "json_data" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "user_id" int8,
    "place_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."place_saved" (
    "place_saved_id" bigserial PRIMARY KEY,
    "user_id" int8,
    "place_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."places" (
    "place_id" bigserial PRIMARY KEY,
    "name" varchar(100),
    "thumbnail_url" text,
    "json_data" jsonb,
    "region" varchar(100),
    "location" jsonb,
    "city_id" int8
  );`);

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

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."plan_schedules" (
    "plan_schedule_id" bigserial PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "start_time" timestamp(6),
    "end_time" timestamp(6),
    "location" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "activity_id" int8,
    "plan_place_id" int8
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

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."provinces" (
    "province_id" bigserial PRIMARY KEY,
    "name" varchar(100)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."reactions" (
    "reaction_id" bigserial PRIMARY KEY,
    "name" varchar(50)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."schedule_activities" (
    "schedule_activity_id" bigserial PRIMARY KEY,
    "name" varchar(255),
    "description" varchar(255),
    "start_time" timestamp(6),
    "end_time" timestamp(6),
    "location" jsonb,
    "created_at" timestamp(6),
    "updated_at" timestamp(6),
    "activity_id" int8
  );`);
};
