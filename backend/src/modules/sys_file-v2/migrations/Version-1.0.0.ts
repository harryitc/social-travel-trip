module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."file_system_v2" (
    "file_system_id" bigserial PRIMARY KEY,
    "file_type" varchar(256),
    "client_filename" varchar(256),
    "server_filename" varchar(256),
    "file_group" varchar(256),
    "filepath" varchar(256),
    "file_ext" varchar(10),
    "view_type" varchar(50),
    "user_create" varchar(128),
    "user_update" varchar(128),
    "file_size" numeric,
    "time_create" timestamp(6) without timezone,
    "time_update" timestamp(6) without timezone,
    "resize_path" jsonb
  );`);
};
