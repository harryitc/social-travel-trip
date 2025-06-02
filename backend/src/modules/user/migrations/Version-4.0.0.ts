// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`ALTER TABLE ${schema}."users"
    ADD "email" varchar(255)
    ;`);
};
