module.exports = async (client, schema) => {
  // Update created_at column to timestamp without time zone with default in notifications table
  await client.query(`ALTER TABLE ${schema}."notifications"
    ALTER COLUMN "created_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp;`);
};
