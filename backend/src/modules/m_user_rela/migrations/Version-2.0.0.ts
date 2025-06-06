module.exports = async (client, schema) => {
  // Update created_at column to timestamp without time zone with default in user_rela table
  await client.query(`ALTER TABLE ${schema}."user_rela"
    ALTER COLUMN "created_at" TYPE timestamp(6) WITHOUT TIME ZONE,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp;`);
};
