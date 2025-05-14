// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."users" (
    "id" bigserial PRIMARY KEY,
    "user_id" bigserial,
    "name" varchar(255)
  );`);
};
