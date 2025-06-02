// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`ALTER TABLE ${schema}."users"
    ADD "full_name" varchar(255),
    ADD "phone_number" varchar(255),
    ADD "date_of_birth" date,
    ADD "gender" bit,
    ADD "address" varchar(255),
    ADD "json_data" jsonb,
    ADD "created_at" timestamp(6) without timezone,
    ADD "updated_at" timestamp(6) without timezone
    ;`);
};
