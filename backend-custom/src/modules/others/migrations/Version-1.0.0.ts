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

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."provinces" (
    "province_id" bigserial PRIMARY KEY,
    "name" varchar(100)
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."reactions" (
    "reaction_id" bigserial PRIMARY KEY,
    "name" varchar(50)
  );`);
};
