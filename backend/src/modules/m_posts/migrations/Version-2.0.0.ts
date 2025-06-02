module.exports = async (client, schema) => {
  // Update created_at and updated_at columns to timestamp without time zone with default in posts table
  await client.query(`ALTER TABLE ${schema}."posts"
    ALTER COLUMN "created_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);
};
